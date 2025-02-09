import React from 'react'
import { PressableProps, Text, View } from 'react-native'
import { Pressable as BasePressable } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { cva, VariantProps } from 'class-variance-authority'
import { LucideIcon } from 'lucide-react-native'
import { cn } from '@/lib/cn'

const DURATION = 300

const Pressable = Animated.createAnimatedComponent(BasePressable)

const buttonVariants = cva('items-center justify-center rounded-md p-2', {
  variants: {
    variant: {
      primary: 'bg-primary border border-primary',
      secondary: 'bg-background border border-primary',
      ghost: 'bg-transparent border border-transparent',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

const iconVariants = cva('', {
  variants: {
    variant: {
      primary: 'color-primary-foreground',
      secondary: 'color-primary',
      ghost: 'color-primary',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonProps = {
  title?: string
  icon?: LucideIcon
} & VariantProps<typeof buttonVariants> &
  PressableProps

const Button = React.forwardRef<
  React.ComponentRef<typeof BasePressable>,
  ButtonProps
>(({ className, title, icon, variant, ...props }, ref) => {
  const Icon = icon
  const transition = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(transition.value, [0, 1], [1, 0.95]),
        },
      ],
    }
  })

  return (
    <Pressable
      ref={ref}
      {...props}
      style={animatedStyle}
      onPressIn={() => {
        transition.value = withTiming(1, { duration: DURATION })
      }}
      onPressOut={() => {
        transition.value = withTiming(0, { duration: DURATION })
      }}
      className={cn(buttonVariants({ variant, className }))}
    >
      <View className="flex-row">
        {Icon ? (
          <Icon
            size={16}
            style={animatedStyle}
            className={iconVariants({ variant })}
          />
        ) : (
          <></>
        )}
        {title ? (
          <Text className="text-primary-foreground" selectable={false}>
            {title}
          </Text>
        ) : (
          <></>
        )}
      </View>
    </Pressable>
  )
})
Button.displayName = 'Button'

export { Button }
