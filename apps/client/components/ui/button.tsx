import { Pressable, PressableProps, Text } from 'react-native'
import { cn } from '@/lib/cn'

type ButtonProps = PressableProps

export function Button({ className, ...props }: ButtonProps) {
  return (
    <Pressable {...props} className={cn('', className)}>
      <Text>Button</Text>
    </Pressable>
  )
}
