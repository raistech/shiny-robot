import type { Context, NextFunction } from 'grammy';
import type { Logger } from 'pino';

export function loggingMiddleware(logger: Logger) {
  return async (ctx: Context, next: NextFunction) => {
    const from = ctx.from
      ? `${ctx.from.username ?? ctx.from.first_name} (${ctx.from.id})`
      : 'unknown';
    logger.debug({ update_id: ctx.update.update_id, from }, 'Incoming update');
    await next();
  };
}
