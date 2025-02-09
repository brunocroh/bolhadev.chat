import React from 'react'
import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const textVariants = cva('text-primary', {
  variants: {
    variant: {
      largeTitle: 'text-4xl',
      title1: 'text-3xl',
      title2: 'text-2xl',
      title3: 'text-xl',
      headline: 'font-semibold text-lg',
      body: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

type TextProps = VariantProps<typeof textVariants> & RNTextProps

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, TextProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        className={cn(textVariants({ variant, className }))}
        {...props}
      ></RNText>
    )
  }
)
Text.displayName = 'Text'

export { Text }
