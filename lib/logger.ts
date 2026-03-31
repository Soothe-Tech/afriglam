type LogLevel = 'info' | 'warn' | 'error';

const REDACT_KEYS = new Set([
  'authorization',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'signature',
  'rawBody',
  'password',
  'serviceRoleKey',
]);

const sanitize = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        REDACT_KEYS.has(key) ? '[redacted]' : sanitize(nested),
      ])
    );
  }
  return value;
};

const print = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
  const sanitizedMeta = meta ? (sanitize(meta) as Record<string, unknown>) : {};
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...sanitizedMeta,
  };
  const line = JSON.stringify(payload);
  if (level === 'error') {
    console.error(line);
    return;
  }
  if (level === 'warn') {
    console.warn(line);
    return;
  }
  console.log(line);
};

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => print('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => print('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => print('error', message, meta),
};
