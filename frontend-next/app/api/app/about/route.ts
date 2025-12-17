import { NextResponse } from "next/server";

export async function GET() {
  // Mock data for testing purposes
  // In production, this would be proxied to the backend
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
