import { z } from 'zod';

export const envSchema = z.object({
  BOT_TOKEN: z.string().min(1, 'BOT_TOKEN is required'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const message = Object.entries(fieldErrors)
      .map(([k, v]) => `${k}: ${v?.join(', ')}`)
      .join('\n');
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:\n' + message);
    process.exit(1);
  }
  return parsed.data;
}
