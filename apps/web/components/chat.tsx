'use client'

import React, { useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Message } from '@/app/room/[slug]/page'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

interface ChatProps {
  messages: Message[]
  onSend: (message: string) => void
}

export function Chat({ messages, onSend }: ChatProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      const message = inputValue.trim()
      onSend(message)
      setInputValue('')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <ScrollArea className="flex h-48 w-1/2 flex-col justify-center gap-2 rounded-lg border p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center">
            <MessageCircle className="text-muted" />
            <span className="italic text-muted">No messages yet</span>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="w-full">
              <MessageItem message={message} />
            </div>
          ))
        )}
      </ScrollArea>

      <div className="flex w-1/2 flex-row gap-2 rounded-lg align-baseline">
        <Input
          placeholder="Type a message..."
          value={inputValue}
          ref={inputRef}
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}

const MessageItem = ({ message }: { message: Message }) => {
  const isMe = message.sender === 'Me'
  return (
    <div
      className={`flex items-center gap-3 justify-${isMe ? 'start' : 'end'}`}
    >
      <span
        className={`bg-${isMe ? 'accent' : 'purple-950'} m-1 max-w-xs rounded-md p-3`}
      >
        <span className="text-sm font-semibold">{message.sender}</span>:{' '}
        <span className="text-sm">{message.content}</span>
      </span>
    </div>
  )
}
