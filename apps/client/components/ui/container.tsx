import { View, ViewProps } from 'react-native'
import { cn } from '@/lib/cn'

export function Container({ children, className }: ViewProps) {
  return <View className={cn('p-safe flex-1', className)}>{children}</View>
}
