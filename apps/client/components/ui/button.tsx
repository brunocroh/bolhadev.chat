import { Pressable, PressableProps, Text } from 'react-native'
import { cn } from '@/lib/cn'

type ButtonProps = {
  title: string
} & PressableProps

export function Button({ className, title, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      className={cn(
        'items-center justify-center rounded-md bg-primary p-2',
        className
      )}
    >
      <Text className="text-primary-foreground">{title}</Text>
    </Pressable>
  )
}
