import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * Modifies the response to include Session and Request IDs.
 * Usage: return applyLoggerSession(request, response);
 */
export function applyLoggerSession(
  request: NextRequest,
  response: NextResponse
) {
  // 1. Trace the Session (Cookie)
  let sessionId = request.cookies.get("session_id")?.value;
  if (!sessionId) {
    sessionId = uuidv4();
    response.cookies.set("session_id", sessionId, { maxAge: 60 * 60 * 24 }); // 24h
  }

  // 2. Trace the Request (Unique ID for this click)
  const requestId = uuidv4();

  // 3. Pass to Server Components via Headers
  response.headers.set("x-logger-session-id", sessionId);
  response.headers.set("x-logger-request-id", requestId);

  return response;
}
