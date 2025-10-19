import pino from 'pino';
import type { Env } from '../config/env';

export function createLogger(env: Env) {
  return pino({
    level: env.LOG_LEVEL,
    base: { env: env.NODE_ENV },
  });
}
