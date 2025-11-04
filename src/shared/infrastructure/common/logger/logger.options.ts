export function getLoggerOptions() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return {
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname,reqId',
            messageFormat: '{correlationId} [{level}] {msg}',
          },
        }
      : undefined,
  };
}
