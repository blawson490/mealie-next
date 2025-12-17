import { AppAboutConfig } from "../types/app-config";

/**
 * Fetches the application configuration from the backend API.
 * @returns Promise resolving to AppAboutConfig
 * @throws Error if the fetch fails
 */
export async function fetchAppConfig(): Promise<AppAboutConfig> {
  const response = await fetch("/api/app/about");
  
  if (!response.ok) {
    throw new Error(`Failed to fetch app config: ${response.statusText}`);
  }
  
  return response.json();
}
