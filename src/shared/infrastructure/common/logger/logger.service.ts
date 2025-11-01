// Solo exportar tipos básicos - no wrappers complejos
export interface LogContext {
  correlationId?: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  userId?: string;
  [key: string]: any;
}

export interface LogMetadata {
  [key: string]: any;
}

export interface LogError extends Error {
  name: string;
  message: string;
  stack?: string;
}

export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}