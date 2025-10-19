import type { Bot } from 'grammy';

export function registerStartCommand(bot: Bot) {
  bot.command('start', async (ctx) => {
    const name = ctx.from?.first_name ?? 'there';
    await ctx.reply(
      `Hi ${name}! I am a grammY bot. Try /ping to check if I'm responsive.`,
    );
  });
}
