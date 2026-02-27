import { createServer } from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'

const httpServer = createServer()

const io = new Server(httpServer, {
  path: '/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

interface User {
  id: string
  username: string
}

interface Message {
  id: string
  username: string
  content: string
  timestamp: string
  type: 'user' | 'system'
}

const users = new Map<string, User>()

const generateMessageId = () => randomUUID()

const createSystemMessage = (content: string): Message => ({
  id: generateMessageId(),
  username: 'System',
  content,
  timestamp: new Date().toISOString(),
  type: 'system'
})

const createUserMessage = (username: string, content: string): Message => ({
  id: generateMessageId(),
  username,
  content,
  timestamp: new Date().toISOString(),
  type: 'user'
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('join', (data: { username: string }) => {
    const username = data.username?.trim()

    if (!username || username.length > 20) {
      socket.emit('error', { message: 'Invalid username' })
      return
    }

    const user: User = {
      id: socket.id,
      username
    }

    users.set(socket.id, user)

    const joinMessage = createSystemMessage(`${username} joined the chat`)
    io.emit('user-joined', { user, message: joinMessage })

    socket.emit('users-list', { users: Array.from(users.values()) })

    console.log(`${username} joined. Online: ${users.size}`)
  })

  socket.on('message', (data: { content: string }) => {
    const user = users.get(socket.id)
    if (!user) return

    const content = data.content?.trim()

    if (!content || content.length > 500) return

    const message = createUserMessage(user.username, content)

    io.emit('message', message)

    console.log(`${user.username}: ${content}`)
  })

  socket.on('disconnect', () => {
    const user = users.get(socket.id)

    if (user) {
      users.delete(socket.id)

      const leaveMessage = createSystemMessage(`${user.username} left the chat`)
      io.emit('user-left', { user, message: leaveMessage })

      console.log(`${user.username} left. Online: ${users.size}`)
    }
  })

  socket.on('error', (err) => {
    console.error(`Socket error (${socket.id}):`, err)
  })
})

const PORT = 3003

httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

function shutdown() {
  console.log('Shutting down server...')
  httpServer.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
}