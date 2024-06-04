"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var zod_1 = require("zod");
var env_nextjs_1 = require("@t3-oss/env-nextjs");
exports.env = (0, env_nextjs_1.createEnv)({
    server: {
        NEXT_SUPABASE_URL: zod_1.z.string(),
        NEXT_SUPABASE_KEY: zod_1.z.string(),
    },
    client: {
        NEXT_PUBLIC_SOCKET_URL: zod_1.z.string().default('ws://localhost:4000'),
    },
    runtimeEnv: {
        NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
        NEXT_SUPABASE_URL: process.env.NEXT_SUPABASE_URL,
        NEXT_SUPABASE_KEY: process.env.NEXT_SUPABASE_KEY,
    },
    emptyStringAsUndefined: true,
});
