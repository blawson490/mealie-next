import { baseRequest } from "@/lib/http/base-request";
import {
  ApiRequestConfig,
  ApiRequestInstance,
  RequestResponse,
} from "../types";

export class ApiRequestAdapter implements ApiRequestInstance {
  async get<T, P = unknown>(
    url: string,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>> {
    return this.request<T, P>(url, { ...config, method: "GET" });
  }

  async post<T, P = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>> {
    return this.request<T, P>(url, { ...config, method: "POST" }, data);
  }

  async put<T, P = unknown>(
    url: string,
    data: unknown,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>> {
    return this.request<T, P>(url, { ...config, method: "PUT" }, data);
  }

  async patch<T, P = unknown>(
    url: string,
    data: unknown,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>> {
    return this.request<T, P>(url, { ...config, method: "PATCH" }, data);
  }

  async delete<T, P = unknown>(
    url: string,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>> {
    return this.request<T, P>(url, { ...config, method: "DELETE" });
  }

  private async request<T, P>(
    path: string,
    config: ApiRequestConfig<P>,
    data?: unknown
  ): Promise<T> {
    const { timeoutMs, retries, params, ...fetchInit } = config;
    const headers = new Headers(fetchInit.headers);

    let finalPath = path;
    if (params) {
      const searchParams = new URLSearchParams();
      // Cast params to a record so we can iterate
      Object.entries(params as Record<string, unknown>).forEach(
        ([key, value]) => {
          if (value === undefined || value === null) return;

          // Handle Arrays (e.g. ?ids=1&ids=2)
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      );
      const queryString = searchParams.toString();
      if (queryString) {
        finalPath += (path.includes("?") ? "&" : "?") + queryString;
      }
    }

    let body: BodyInit | null | undefined = undefined;

    if (data !== undefined && data !== null) {
      if (headers.has("Content-Type")) {
        const contentType = headers.get("Content-Type") || "";

        if (contentType.includes("x-www-form-urlencoded")) {
          body = new URLSearchParams(data as Record<string, string>).toString();
        } else if (contentType.includes("application/json")) {
          // ✅ FIX: Stringify if header is present
          body = typeof data === "string" ? data : JSON.stringify(data);
        } else {
          body = data as BodyInit;
        }
      } else if (data instanceof FormData) {
        headers.delete("Content-Type");
        body = data;
      } else if (data instanceof URLSearchParams) {
        headers.set("Content-Type", "application/x-www-form-urlencoded");
        body = data.toString();
      } else {
        headers.set("Content-Type", "application/json");
        body = JSON.stringify(data);
      }
    }

    return baseRequest<T>(
      finalPath,
      { ...fetchInit, headers, body },
      { timeoutMs, retries }
    );
  }
}

export const apiRequest = new ApiRequestAdapter();
