import { NextResponse } from "next/server";

/**
 * TEMPORARY Mock API Endpoint
 * 
 * This endpoint provides mock configuration data for development and testing.
 * 
 * In production, this endpoint will be proxied to the backend API at
 * http://localhost:9000/api/app/about (see next.config.ts rewrites).
 * 
 * Once the backend is available and the proxy is working, this file
 * should be REMOVED as it will no longer be needed.
 */
export async function GET() {
  const mockConfig = {
    production: false,
    version: "1.0.0-dev",
    demoStatus: true,
    allowSignup: true,
    allowPasswordLogin: true,
    defaultGroupSlug: "home",
    defaultHouseholdSlug: "main",
    enableOidc: true,
    oidcRedirect: false,
    oidcProviderName: "Google",
    enableOpenai: true,
    enableOpenaiImageServices: true,
  };

  return NextResponse.json(mockConfig);
}
