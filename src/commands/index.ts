import type { Bot } from 'grammy';
import { registerStartCommand } from './start';
import { registerPingCommand } from './ping';

export function registerCommands(bot: Bot) {
  registerStartCommand(bot);
  registerPingCommand(bot);
}
