"use server";

import { db } from "./db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { LogLevel, Metadata } from "./types";

/**
 * Server-side logging function that writes to the SQLite database.
 * This is a server action and can be safely called from client components.
 */
async function writeLog(
  level: LogLevel,
  message: string,
  meta?: Metadata
): Promise<void> {
  try {
    let sessionId = "anonymous";
    let requestId = "unknown";
    let userId = null;

    try {
      const headerList = await headers();
      sessionId = headerList.get("x-logger-session-id") || "anonymous";
      requestId = headerList.get("x-logger-request-id") || "unknown";
      userId = headerList.get("x-logger-user-id") || null;
    } catch {
      // Not in a request context (e.g. testing)
    }

    const stmt = db.prepare(`
      INSERT INTO logs (level, message, session_id, request_id, user_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      level,
      message,
      sessionId,
      requestId,
      userId,
      JSON.stringify(meta || {})
    );
  } catch (e) {
    console.error("Logger failed:", e);
  }
}

// Export all logging server actions
export async function logInfo(message: string, meta?: object) {
  return writeLog("info", message, meta);
}

export async function logWarn(message: string, meta?: object) {
  return writeLog("warn", message, meta);
}

export async function logError(message: string, error?: any) {
  return writeLog("error", message, {
    error: error?.message || error,
    stack: error?.stack,
  });
}

export async function logMetric(
  metricName: string,
  value: number,
  meta?: object
) {
  return writeLog("info", `Metric: ${metricName} = ${value}`, meta);
}

export async function logEvent(eventName: string, meta?: object) {
  return writeLog("info", `Event: ${eventName}`, meta);
}

export async function logSuccess(message: string, meta?: object) {
  return writeLog("info", `Success: ${message}`, meta);
}

export async function logDebug(message: string, meta?: object) {
  return writeLog("info", `Debug: ${message}`, meta);
}

/**
 * Identify a user and stitch their session logs.
 */
export async function identify(userId: string, traits?: Record<string, any>) {
  try {
    let sessionId = "anonymous";
    try {
      const headerList = await headers();
      sessionId = headerList.get("x-logger-session-id") || "anonymous";
    } catch {
      // Not in request context
    }

    // 1. Update/Insert Identity
    const upsertIdentity = db.prepare(`
      INSERT INTO identities (user_id, traits, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        traits = excluded.traits,
        updated_at = CURRENT_TIMESTAMP
    `);
    upsertIdentity.run(userId, JSON.stringify(traits || {}));

    // 2. Session Stitching: Link all anonymous logs from this session to the user_id
    if (sessionId !== "anonymous") {
      const stitch = db.prepare(`
        UPDATE logs
        SET user_id = ?
        WHERE session_id = ? AND user_id IS NULL
      `);
      stitch.run(userId, sessionId);
    }

    await logInfo(`User Identified: ${userId}`, { userId, traits });
  } catch (e) {
    console.error("Identification failed:", e);
  }
}

/**
 * Fetch logs for the UI.
 */
export async function getLogs(limit = 1000) {
  try {
    const logs = db
      .prepare(
        `
      SELECT l.*, i.traits as user_traits
      FROM logs l
      LEFT JOIN identities i ON l.user_id = i.user_id
      ORDER BY l.timestamp DESC
      LIMIT ?
    `
      )
      .all(limit) as any[];

    return logs.map((log) => ({
      ...log,
      metadata: JSON.parse(log.metadata || "{}"),
      user_traits: JSON.parse(log.user_traits || "{}"),
    }));
  } catch (e) {
    console.error("Failed to fetch logs:", e);
    return [];
  }
}

export async function clearLogs() {
  db.prepare("DELETE FROM logs").run();
  db.prepare("DELETE FROM identities").run();
  revalidatePath("/admin/logs");
}
