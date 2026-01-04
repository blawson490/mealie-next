import { ApiError, ApiErrorRequestDebug } from "../api/api-error-type";

/**
 * Determine the base URL to use for API requests.
 *
 * On the server, returns BACKEND_URL (trimmed) from environment or "http://localhost:9000" if unset, with any trailing slash removed.
 * In the browser, returns an empty string so relative URLs are used (Next.js rewrites handle routing).
 *
 * @returns The base URL to use for server-side API requests; an empty string when running in the browser.
 */
export function getApiBaseUrl(): string {
  // Server-side: use backend URL from environment
  if (typeof window === "undefined") {
    const rawUrl = process.env.BACKEND_URL || "http://localhost:9000";
    const backendUrl = rawUrl.trim();
    return backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
  }
  // Client-side: use relative URLs (Next.js rewrites handle routing)
  return "";
}

function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    // Redact sensitive keys if necessary
    if (key.toLowerCase() === "authorization") {
      obj[key] = "Bearer [REDACTED]";
    } else {
      obj[key] = value;
    }
  });
  return obj;
}

function safeParseBody(body: BodyInit | null | undefined): unknown {
  if (body === null || body === undefined) return undefined;

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }

  if (body instanceof FormData) {
    const obj: Record<string, unknown> = {};
    body.forEach((value, key) => {
      obj[key] = value instanceof File ? `(File: ${value.name})` : value;
    });
    return obj;
  }

  if (body instanceof URLSearchParams) {
    return Object.fromEntries(body.entries());
  }

  return body;
}

/**
 * Perform a JSON HTTP request against the API with built-in timeout, retry, and unified error messages.
 *
 * @param path - Request path appended to the API base URL; may start with or without a leading `/`.
 * @param init - Optional fetch RequestInit overrides; `Content-Type` defaults to `application/json` and `cache` defaults to `no-store` if not provided.
 * @param options - Optional behavior controls:
 *   - `timeoutMs`: per-request timeout in milliseconds (defaults to NEXT_PUBLIC_API_TIMEOUT_MS or 10000).
 *   - `retries`: number of retry attempts for network errors and 5xx responses (defaults to 3).
 * @returns The parsed JSON response as type `T`.
 * @throws Error when a non-OK HTTP response is received after retries (message includes status and URL), when the response body cannot be parsed as JSON (includes status and a 100-character preview), or when a network/timeout error occurs after all retries (message includes URL and underlying error).
 */
export async function baseRequest<T>(
  path: string,
  init?: RequestInit,
  options?: { timeoutMs?: number; retries?: number }
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const timeoutMs =
    options?.timeoutMs ??
    Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 10000);
  const retries = Math.max(0, options?.retries ?? 3);

  let attempt = 0;

  // 1. Prepare Headers (moved outside loop partially, but Auth might need refresh per attempt in some apps,
  // keeping it inside is fine, but we capture it for the error log).

  while (true) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Prepare headers for this attempt
    const headers = new Headers(init?.headers as HeadersInit);
    if (!headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");

    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("mealie.access_token")?.value;

      if (accessToken && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }

    // 2. Create the Request Debug Object
    const requestDebug: ApiErrorRequestDebug = {
      url,
      method: init?.method || "GET",
      headers: headersToObject(headers),
      body: safeParseBody(init?.body),
    };

    try {
      const response = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
        cache: init?.cache ?? "no-store",
        credentials: typeof window === "undefined" ? undefined : "include",
      });

      // 3. Handle Non-OK Responses
      if (!response.ok) {
        // Stop retrying on 4xx errors (except 408/429 usually, but keeping your logic simplified)
        // If 5xx and we have retries left, throw standard Error to trigger retry loop
        if (
          response.status >= 500 &&
          response.status < 600 &&
          attempt < retries
        ) {
          throw new Error(`Server error ${response.status}`);
        }

        let errorDetails: unknown;
        try {
          errorDetails = await response.json();
        } catch {
          errorDetails = await response.text();
        }

        // Throw the enriched ApiError
        throw new ApiError(
          `Request failed: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorDetails,
          {
            request: requestDebug,
            response: {
              status: response.status,
              statusText: response.statusText,
              headers: headersToObject(response.headers),
              data: errorDetails,
            },
          }
        );
      }

      if (response.status === 204) {
        return {} as T;
      }

      const text = await response.text();
      try {
        return JSON.parse(text) as T;
      } catch (err) {
        throw new Error(
          `Invalid JSON received from ${url} (Status: ${
            response.status
          }). \nPreview: ${text.substring(0, 100)}...`
        );
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err; // Pass through our custom error
      }

      const isAbort = err instanceof Error && err.name === "AbortError";
      const isNetwork = err instanceof TypeError;
      const isServerError =
        err instanceof Error && err.message.startsWith("Server error");

      if ((isAbort || isNetwork || isServerError) && attempt < retries) {
        attempt += 1;
        const backoff = 250 * attempt;
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }

      // 4. Handle Final Network/Timeout Errors
      // We wrap these in ApiError too so the UI can still see the Request details
      const message = err instanceof Error ? err.message : String(err);

      // We don't have a response here, but we do have the request debug info
      throw new ApiError(
        `Network error fetching ${url}: ${message}`,
        0,
        "Network Error",
        { originalError: message },
        { request: requestDebug }
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
