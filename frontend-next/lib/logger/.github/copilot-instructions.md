# Drop-in SQLite Logger: AI Instructions
You are an expert TypeScript engineer building a modular, isomorphic logging library for Next.js.

## Core Architecture Rules
1. **Isomorphic Logic**: All logging functions (`logInfo`, `logError`) must check environment.
   - **Server-side**: Import `better-sqlite3` and write directly to the DB.
   - **Client-side**: Use `fetch()` to POST to the internal route `/api/logger`.
2. **Session Stitching**:
   - Every log must include a `session_id`.
   - If a `user_id` is provided later (via `logger.identify()`), the AI should suggest logic to link previous "anonymous" logs with that `session_id` to the new `user_id`.
3. **Push-Based Auth**:
   - Provide an `identify(userId: string, traits?: Record<string, any>)` function.
   - This should "push" user data into the logger's storage so the UI can resolve IDs to Names/Emails.
   - This will stitch together previous "anonymous" logs with the new `user_id` tying them together via the `session_id` as the fingerprint.
4. **Minimal Dependency**: Favor native Node/Web APIs. Only use `better-sqlite3` and `uuid`.

## Technical Constraints
- **Database**: SQLite via `better-sqlite3`. Assume the file is at `process.cwd() + '/logger.sqlite'`.
- **Runtime**: Middleware runs in Edge, but the Logger must run in the Node.js runtime. Use `export const runtime = 'nodejs'` in relevant route handlers.
- **Event Replay**: Focus on the `Context` object. Ensure client-side logs capture `url`, `userAgent`, and `path`.

## Code Style
- Use functional patterns.
- Ensure all types are strictly defined in `types.ts`.
- Wrap database writes in try/catch to ensure the *logger* never crashes the *main app*.
