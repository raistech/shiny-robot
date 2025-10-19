import { Bot } from 'grammy';
import type { Env } from './config/env';
import { createLogger } from './services/logger';
import { loggingMiddleware } from './middleware/logging';
import { registerCommands } from './commands';

export function createBot(env: Env) {
  const bot = new Bot(env.BOT_TOKEN);
  const logger = createLogger(env);

  bot.use(loggingMiddleware(logger));

  registerCommands(bot);

  bot.catch((err) => {
    const ctx = err.ctx;
    logger.error({ err }, `Error while handling update ${ctx.update.update_id}`);
  });

  return { bot, logger };
}
