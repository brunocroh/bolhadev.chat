import Fastify from 'fastify'
import Http from 'http'
import cron from 'node-cron'
import { v4 as uuid } from 'uuid'
import WebSocket, { WebSocketServer } from 'ws'

const fastify = Fastify({
  logger: true,
})

const server = Http.createServer()
const wss = new WebSocketServer({ server })

type Room = {
  host?: string
  users: string[]
}

type QueueMe = {
  type: 'me'
}

type QueueUpdateEvent = {
  type: 'queueJoin' | 'queueExit'
  userId: string
}

type SendOfferEvent = {
  type: 'sendOffer'
  to: string
  signal: any
  from: string
}

type SendAnswerEvent = {
  type: 'sendAnswer'
  to: string
  signal: any
}

type RoomEnterEvent = {
  type: 'roomEnter'
  id: string
  roomId: string
}

type SocketEvents =
  | QueueUpdateEvent
  | QueueMe
  | SendOfferEvent
  | SendAnswerEvent
  | RoomEnterEvent

function broadcastMessage(json) {
  console.log({ json })
  const data = JSON.stringify(json)
  for (const user of users.values()) {
    if (user.readyState === WebSocket.OPEN) {
      user.send(data)
    }
  }
}

const queue = new Set<string>()
const users = new Map<string, WebSocket>()
const rooms = new Map<string, Room>()

wss.on('connection', (ws) => {
  const userId = uuid()
  users.set(userId, ws)

  ws.on('message', (data) => {
    const event = JSON.parse(data.toString()) as SocketEvents

    switch (event.type) {
      case 'me':
        ws.send(JSON.stringify({ type: 'me', id: userId }))
        broadcastMessage({ type: 'usersOnline', size: users.size })
        break
      case 'queueJoin':
        onQueueJoin(event)
        break
      case 'queueExit':
        onQueueExit(event)
        break
      case 'sendOffer':
        onSendOffer(event)
        break
      case 'sendAnswer':
        onSendAnswer(event)
        break
      case 'roomEnter':
        onRoomEnter(event)
        break
      default:
        break
    }
  })

  ws.on('close', () => handleDisconnect(userId))
})

const handleDisconnect = (userId: string) => {
  queue.delete(userId)
  users.delete(userId)
  broadcastMessage({
    type: 'usersOnline',
    size: users.size,
  })
}

const onRoomEnter = async ({ roomId, id }: { roomId: string; id: string }) => {
  let room
  try {
    room = rooms.get(roomId)

    if (!room) return

    room.users.push(id)

    if (room?.users.length === 2) {
      const host = room.users[0]
      const participant = room.users[1]
      room.host = host
      room.users.forEach((user) => {
        const _user = users.get(user)
        // TODO: if user is not connected, send a event to other user to navigate back to queue screen
        if (!_user) {
          return
        }
        _user.send(JSON.stringify({ type: 'hostCall', to: participant }))
      })
    }
  } catch (e) {
    console.error('Fail to create room', e)

    if (room) {
      room?.users.forEach((user) => {
        const _user = users.get(user)
        if (!_user) return
        _user.send(JSON.stringify({ type: 'createRoomFail' }))
      })
      return
    }

    const _user = users.get(id)

    if (_user) {
      _user.send(JSON.stringify({ type: 'createRoomFail' }))
    }
  }
}

const onSendOffer = ({ to, signal, from }: SendOfferEvent) => {
  if (!to) return

  const userTo = users.get(to)

  if (!userTo) {
    // TODO: destroy room and tell to user that other user disconnect
    return
  }

  userTo.send(
    JSON.stringify({
      type: 'receiveOffer',
      signal,
      from,
      to,
    })
  )
}

const onSendAnswer = ({ to, signal }: SendAnswerEvent) => {
  if (!to) return

  const userTo = users.get(to)

  if (!userTo) {
    // TODO: destroy room and tell to user that other user disconnect
    return
  }

  userTo.send(
    JSON.stringify({
      type: 'receiveAnswer',
      signal,
    })
  )
}

const onQueueJoin = ({ userId }: QueueUpdateEvent) => {
  queue.add(userId)
}

const onQueueExit = ({ userId }: QueueUpdateEvent) => {
  queue.delete(userId)
}

server.listen(4000, () => {
  console.log('Server up')
})

cron.schedule('*/15 * * * * *', () => {
  const _queue = Array.from(queue).sort(() => Math.random() - 0.5)

  for (; _queue.length >= 2; ) {
    const roomId = uuid()
    const _users = Array.from(_queue.splice(0, 2))
    const room: Room = { users: _users, host: _users[0] }

    rooms.set(roomId, { host: undefined, users: [] })

    try {
      _users
        .map((userId) => {
          const userSocket = users.get(userId)
          if (!userSocket) {
            throw 'User is not connected'
          }

          return {
            ws: userSocket,
            userId,
          }
        })
        .forEach(({ ws, userId }) => {
          ws.send(JSON.stringify({ type: 'roomFound', room, roomId }))
          users.delete(userId)
          queue.delete(userId)
        })
    } catch (e) {
      console.warn('Fail to create a room', e)
    }
  }
})

fastify.get('/', function (_, reply) {
  reply.send({ hello: 'world' })
})

fastify.listen({ port: 4001 }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
