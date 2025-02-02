import clsx from 'clsx'

export type Message = {
  sender: 'me' | 'other'
  content: string
}

type MessageItemProps = {
  message: Message
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const isMe = message.sender === 'me'

  return (
    <div
      className={clsx(
        'flex items-center gap-3',
        isMe ? 'justify-end' : 'justify-start'
      )}
    >
      <span
        className={clsx(
          'm-1 max-w-xs rounded-md p-3',
          isMe ? 'bg-accent' : 'bg-purple-950'
        )}
      >
        <span className="text-sm">{message.content}</span>
      </span>
    </div>
  )
}
