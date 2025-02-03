import { View, ViewProps } from 'react-native'
import { cn } from '@/lib/cn'

export function Container({ children, className }: ViewProps) {
  return <View className={cn('p-safe', className)}>{children}</View>
}
