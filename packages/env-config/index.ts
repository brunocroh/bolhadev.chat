import { z } from 'zod'
import { createEnv } from '@t3-oss/env-nextjs'

export const env = createEnv({
  server: {
    NEXT_SUPABASE_URL: z.string(),
    NEXT_SUPABASE_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().default('http://localhost:3000'),
    NEXT_PUBLIC_SOCKET_URL: z.string().default('ws://localhost:4000'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL,
    NEXT_SUPABASE_KEY: process.env.NEXT_SUPABASE_KEY,
  },
  emptyStringAsUndefined: true,
})
