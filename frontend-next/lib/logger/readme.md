# 📦 Drop-in SQLite Logger

A modular, self-hosted observability engine for Next.js. Track sessions, log errors, and "replay" user events using a local SQLite database.

## Features
- **Isomorphic**: Works in Server Actions, API Routes, and Client Components.
- **Session Stitching**: Automatically links anonymous browsing to authenticated users.
- **Event Replay**: View a chronological timeline of user actions and system errors.
- **Zero-SaaS**: Your data stays in your Docker container/server.

## Installation

1. **Install**
```bash
   npm install better-sqlite3 uuid

2. **Initialize**
Place the /logger directory into your lib folder.

3. **Global Context (Middleware)**
    ```ts
    // middleware.ts
    export function middleware(req) {
      return applyLoggerSession(req); // Sets the session cookie
    }
    ```

4. **Create Admin Page Create `app/admin/logs/page.tsx`**
   ```ts
   export default function AdminLogsPage() {
     return;
   }
   ```

---
## Usage
1. **Identify Users (Auth Integration)**
Link a session to a specific user. This "pushes" user data to the logger for better admin UI visibility.

```ts
import { logger } from "@/lib/logger";

// Inside your login/auth logic
logger.identify(user.id, {
  email: user.email,
  plan: "pro"
});
```

2. **Automatic Action Logging**

```ts
import { withLog } from "@/lib/logger";

export async function updateProfile(data: any) {
  return withLog("Update Profile", async () => {
    // Logic here...
  });
}
```

3. **Client-Side Event Tracking**

```ts
"use client";
import { logInfo } from "@/lib/logger/client";

<button onClick={() => logInfo("Clicked Signup", { location: "hero" })>
  Sign Up
</button>
```

### Modular Extension
The Metadata and Context types are designed to be extended. You can add project-specific fields to the LogEntry type without breaking the core engine.
---

## 🧪 Testing the Module

You can verify the logger is working correctly without running the full Next.js app:

1. **Install dev dependencies**: `npm install -D tsx`
2. **Run the test script**: `npm test`

This runs a standalone verification of the SQLite initialization, logging persistence, and the auto-cleanup triggers.

---

## 🛡️ Database Details
- **Storage**: Data is saved to `app-logs.db` in your project root.
- **Auto-Cleanup**: The database automatically caps itself at 10,000 logs to prevent disk bloat.
- **Privacy**: Zero-SaaS. All logs stay on your server.
