export type LogEntry = {
  id: number;
  timestamp: string;
  component?: string;
  level: LogLevel;
  message: string;
  session_id: string;
  user_id?: string;
  metadata?: Metadata;
  context?: Context;
  stack?: string;
};

export type Context = {
  userAgent: string;
  ip: string;
  platform: string;
  language: string;
  screenResolution: string;
  url: string;
};

export type LogLevel = "info" | "error" | "warn";
export type Environment = "development" | "production" | "staging";

export type Metadata = {
  environment?: Environment;
  version?: string;
  [key: string]: any;
};
