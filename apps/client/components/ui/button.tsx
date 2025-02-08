import React from 'react'
import { PressableProps, Text } from 'react-native'
import { Pressable as BasePressable } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { cn } from '@/lib/cn'

type ButtonProps = {
  title: string
} & PressableProps

const DURATION = 300

const Pressable = Animated.createAnimatedComponent(BasePressable)

const Button = React.forwardRef<
  React.ComponentRef<typeof BasePressable>,
  ButtonProps
>(({ className, title, ...props }, ref) => {
  const transition = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(transition.value, [0, 1], [1, 0.98]),
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
      className={cn(
        'items-center justify-center rounded-md bg-primary p-2',
        className
      )}
    >
      <Text className="text-primary-foreground" selectable={false}>
        {title}
      </Text>
    </Pressable>
  )
})
Button.displayName = 'Button'

export { Button }
