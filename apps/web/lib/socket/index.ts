import { env } from "@repo/env-config"

const URL = env.NEXT_PUBLIC_SOCKET_URL

export const socket = () => {
  return new WebSocket(URL)
}
