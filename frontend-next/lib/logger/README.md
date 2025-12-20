# Drop-in SQLite Logger

A minimal-dependency, open source, and self-hosted logging module for Next.js App Router.

Features: Automatic session tracking, database size caps, and a built-in UI.

## Installation

1. **Install Dependencies**

   ```bash
   `npm install better-sqlite3 uuid`
   `npm install -D @types/better-sqlite3 @types/uuid`

   ```

2. **Copy Folder**
   Place this entire `logger` directory into `/lib`.

3. **Configure Middleware**
   Import the session helper in your root `middleware.ts`. This attaches the tracking IDs to the request headers.

   ```ts
   // middleware.ts
   import { NextResponse } from "next/server";
   import { applyLoggerSession } from "@/lib/logger/middleware";

   export function middleware(request: Request) {
     const response = NextResponse.next();

     // 1. Pass the objects to the logger helper
     return applyLoggerSession(request, response);
   }
   ```

4. **Create Admin Page Create `app/admin/logs/page.tsx`**
   Place this entire `logger` directory into `/lib`.

## Usage

1.  **Automatic Action Logging (Recommended)**
    Wrap your Server Actions with withLog. This automatically records the user ID, session ID, execution time, and catches any errors.

    ```ts
    import { withLog } from "@/lib/logger";

    export async function loginUser(formData: FormData) {
      return withLog("User Login", async () => {
        // ... your login logic ...
        // If this throws, it logs [ERROR]. If it finishes, it logs [INFO].
      });
    }
    ```

2.  **Manual Logging**
    For specific events inside your logic.

    ````ts
    import { logInfo, logError } from '@/lib/logger';

        logInfo("Subscription updated", { plan: "pro" });
        logError("Payment gateway timeout");
        ```
    ````
