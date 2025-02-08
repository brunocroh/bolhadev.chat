import { PressableProps, Text } from 'react-native'
import { Pressable } from 'react-native'
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function Button({ className, title, ...props }: ButtonProps) {
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
    <AnimatedPressable
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
    </AnimatedPressable>
  )
}
