import {
  logInfo as serverLogInfo,
  logWarn as serverLogWarn,
  logError as serverLogError,
  logSuccess as serverLogSuccess,
  logDebug as serverLogDebug,
  logEvent as serverLogEvent,
  logMetric as serverLogMetric,
  identify as serverIdentify,
  getLogs as serverGetLogs,
} from "./actions";

/* --- ISOMORPHIC WRAPPERS --- */
// These check the environment and use the appropriate transport:
// - Server: Call server actions directly (writes to SQLite)
// - Client: Use fetch() to the /api/logger route

async function clientLog(data: any) {
  try {
    const res = await fetch("/api/logger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Client logger failed:", err);
  }
}

const isServer = typeof window === "undefined";

export async function logInfo(message: string, meta?: object) {
  if (isServer) return serverLogInfo(message, meta);
  return clientLog({ level: "info", message, meta });
}

export async function logWarn(message: string, meta?: object) {
  if (isServer) return serverLogWarn(message, meta);
  return clientLog({ level: "warn", message, meta });
}

export async function logError(message: string, error?: any) {
  if (isServer) return serverLogError(message, error);
  // Extract serializable parts of error
  const errorData = error instanceof Error ? { message: error.message, stack: error.stack } : error;
  return clientLog({ level: "error", message, error: errorData });
}

export async function logSuccess(message: string, meta?: object) {
  if (isServer) return serverLogSuccess(message, meta);
  return clientLog({ level: "info", message: `Success: ${message}`, meta });
}

export async function logDebug(message: string, meta?: object) {
  if (isServer) return serverLogDebug(message, meta);
  return clientLog({ level: "info", message: `Debug: ${message}`, meta });
}

export async function logEvent(eventName: string, meta?: object) {
  if (isServer) return serverLogEvent(eventName, meta);
  return clientLog({ level: "event", eventName, meta });
}

export async function logMetric(
  metricName: string,
  value: number,
  meta?: object
) {
  if (isServer) return serverLogMetric(metricName, value, meta);
  return clientLog({ level: "metric", metricName, value, meta });
}

export async function identify(userId: string, traits?: Record<string, any>) {
  if (isServer) return serverIdentify(userId, traits);
  return clientLog({ level: "identify", userId, traits });
}

export async function getLogs(limit?: number) {
  // getLogs should only be called on the server or via a server action
  return serverGetLogs(limit);
}


/* --- THE WRAPPER (Your new best friend) --- */
// Usage: await withLog('Login User', async () => { ... })
export async function withLog<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    const result = await fn();
    await serverLogInfo(`Action Success: ${name}`);
    return result;
  } catch (err: any) {
    await serverLogError(`Action Failed: ${name}`, err);
    throw err; // Re-throw so the UI can handle the error state
  }
}
