import { TextInput, TextInputProps, View } from 'react-native'
import { LucideIcon } from 'lucide-react-native'
import colors from 'tailwindcss/colors'
import { cn } from '@/lib/cn'

type InputProps = {
  icon?: LucideIcon
} & TextInputProps

function Input({ className, icon, ...props }: InputProps) {
  const Icon = icon

  return (
    <View className="relative">
      <View className="absolute flex h-10 w-8 items-center justify-center">
        {Icon ? <Icon size={16} color={colors.gray[500]} /> : <></>}
      </View>
      <TextInput
        className={cn(
          'flex h-10 flex-row gap-2 rounded-md border border-input px-3 py-1 pl-8 text-primary focus:border-accent-foreground focus:ring focus:ring-offset-2',
          className
        )}
        {...props}
      />
    </View>
  )
}

export { Input }
