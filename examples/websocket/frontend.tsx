'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type User = {
  id: string;
  username: string;
};

type Message = {
  id: string;
  username: string;
  content: string;
  timestamp: string; // gunakan string saja (ISO dari server)
  type: 'user' | 'system';
};

export default function SocketDemo() {
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // ===============================
  // CONNECT SOCKET (ONLY ONCE)
  // ===============================
  useEffect(() => {
    if (socketRef.current) return;

    const socket = io('/?XTransformPort=3003', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('user-joined', (data: { user: User; message: Message }) => {
      setMessages(prev => [...prev, data.message]);

      setUsers(prev => {
        if (!prev.find(u => u.id === data.user.id)) {
          return [...prev, data.user];
        }
        return prev;
      });
    });

    socket.on('user-left', (data: { user: User; message: Message }) => {
      setMessages(prev => [...prev, data.message]);
      setUsers(prev => prev.filter(u => u.id !== data.user.id));
    });

    socket.on('users-list', (data: { users: User[] }) => {
      setUsers(data.users);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // ===============================
  // AUTO SCROLL
  // ===============================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ===============================
  // JOIN CHAT
  // ===============================
  const handleJoin = () => {
    if (!socketRef.current || !username.trim() || !isConnected) return;

    socketRef.current.emit('join', {
      username: username.trim(),
    });

    setIsUsernameSet(true);
  };

  // ===============================
  // SEND MESSAGE
  // ===============================
  const sendMessage = () => {
    if (!socketRef.current || !inputMessage.trim()) return;

    socketRef.current.emit('message', {
      content: inputMessage.trim(),
      username: username.trim(),
    });

    setInputMessage('');
  };

  // ===============================
  // ENTER KEY HANDLER
  // ===============================
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            WebSocket Demo
            <span
              className={`text-sm px-2 py-1 rounded ${
                isConnected
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isUsernameSet ? (
            <div className="space-y-2">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleJoin();
                  }
                }}
                placeholder="Enter your username..."
                disabled={!isConnected}
              />

              <Button
                onClick={handleJoin}
                disabled={!isConnected || !username.trim()}
                className="w-full"
              >
                Join Chat
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="h-80 w-full border rounded-md p-4">
                <div className="space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No messages yet
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="border-b pb-2 last:border-b-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                msg.type === 'system'
                                  ? 'text-blue-600 italic'
                                  : 'text-gray-700'
                              }`}
                            >
                              {msg.username}
                            </p>

                            <p
                              className={`${
                                msg.type === 'system'
                                  ? 'text-blue-500 italic'
                                  : 'text-gray-900'
                              }`}
                            >
                              {msg.content}
                            </p>
                          </div>

                          <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}

                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={!isConnected}
                  className="flex-1"
                />

                <Button
                  onClick={sendMessage}
                  disabled={!isConnected || !inputMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}