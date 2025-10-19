import type { Bot } from 'grammy';

export function registerPingCommand(bot: Bot) {
  bot.command('ping', (ctx) => ctx.reply('pong'));
}
