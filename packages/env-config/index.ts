import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    NEXT_SUPABASE_URL: z.string(),
    NEXT_SUPABASE_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_SOCKET_URL: z.string().default('ws://localhost:4000'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL,
    NEXT_SUPABASE_KEY: process.env.NEXT_SUPABASE_KEY,
  },
  emptyStringAsUndefined: true,
})
