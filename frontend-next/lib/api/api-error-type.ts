export interface ApiErrorRequestDebug {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
}

export interface ApiErrorResponseDebug {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data?: unknown;
}

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public details: unknown; // The specific error message from the backend (e.g. zod validation)
  public debug: {
    request: ApiErrorRequestDebug;
    response?: ApiErrorResponseDebug;
  };

  constructor(
    message: string,
    status: number,
    statusText: string,
    details: unknown,
    debug: {
      request: ApiErrorRequestDebug;
      response?: ApiErrorResponseDebug;
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.details = details;
    this.debug = debug;
  }
}
