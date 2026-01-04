import { apiRequest } from "../api/base/api-request-adapter";

// Orval will pass this config object to us
export type CustomRequestConfig = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: any;
  data?: any;
  headers?: any;
  signal?: AbortSignal; // Good for cancelling requests if needed
};

// We named this 'serverApi' in the orval.config.ts
export const serverApi = async <T>(config: CustomRequestConfig): Promise<T> => {
  const { url, method, params, data, headers, signal } = config;

  const reqConfig = {
    headers,
    params, // Pass params to adapter so it can append them to URL
    signal,
  };

  switch (method) {
    case "GET":
      const getRes = await apiRequest.get<T>(url, reqConfig);
      return getRes as T; // Assuming your baseRequest returns the data directly or you map it here
    case "POST":
      const postRes = await apiRequest.post<T>(url, data, reqConfig);
      return postRes as T;
    case "PUT":
      const putRes = await apiRequest.put<T>(url, data, reqConfig);
      return putRes as T;
    case "PATCH":
      const patchRes = await apiRequest.patch<T>(url, data, reqConfig);
      return patchRes as T;
    case "DELETE":
      const delRes = await apiRequest.delete<T>(url, reqConfig);
      return delRes as T;
    default:
      throw new Error(`Method ${method} not supported`);
  }
};

export default serverApi;
