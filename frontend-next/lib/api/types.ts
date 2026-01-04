export type RequestResponse<T> = T;

export interface ApiRequestConfig<P = unknown> extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  next?: NextFetchRequestConfig;
  responseType?: "json" | "text" | "blob";
  params?: P;
}

export interface ApiRequestInstance {
  get<T, P = unknown>(
    url: string,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>>;

  post<T, P = unknown>(
    url: string,
    data?: unknown,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>>;

  put<T, P = unknown>(
    url: string,
    data: unknown,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>>;

  patch<T, P = unknown>(
    url: string,
    data: unknown,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>>;

  delete<T, P = unknown>(
    url: string,
    config?: ApiRequestConfig<P>
  ): Promise<RequestResponse<T>>;
}

export interface PaginationData<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  items: T[];
}
