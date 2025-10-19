import 'dotenv/config';
import { loadEnv } from './config/env';
import { createBot } from './bot';

const env = loadEnv();
const { bot, logger } = createBot(env);

process.once('SIGINT', () => {
  logger.info('SIGINT received, stopping bot ...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  logger.info('SIGTERM received, stopping bot ...');
  bot.stop('SIGTERM');
});

bot.start({
  onStart: (me) => {
    logger.info(
      { id: me.id, username: me.username },
      'Bot started via long polling',
    );
  },
});
