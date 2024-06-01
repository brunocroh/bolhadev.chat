const URL = process.env.NEXT_PUBLIC_SOCKET_URL

export const socket = () => {
  return new WebSocket(URL!)
}
