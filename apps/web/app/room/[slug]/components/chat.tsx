'use client'

import React, { useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageItem } from './message-item'

export type Message = {
  sender: 'me' | 'other'
  content: string
}

type Chat = {
  messages: Message[]
  onSend: (message: string) => void
}

export const Chat: React.FC<Chat> = ({ messages, onSend }) => {
  const [inputValue, setInputValue] = useState('')

  const sendMessage = () => {
    const message = inputValue.trim()
    if (message) {
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
    <div className="mb-2 flex w-full flex-col items-center gap-2">
      <ScrollArea className="flex h-48 w-1/2 flex-col justify-center gap-2 rounded-lg border p-4">
        {!messages.length ? (
          <div className="mt-6 flex flex-col items-center">
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
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}
