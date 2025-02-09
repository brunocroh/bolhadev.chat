import React from 'react'
import { Image, ImageProps, View } from 'react-native'

type AvatarProps = {
  uri: string
  size?: number
} & ImageProps

export const Avatar = (props: AvatarProps) => {
  return (
    <View className="items-center justify-center rounded-full bg-primary/80 p-0.5">
      <Image
        width={props.size || 32}
        height={props.size || 32}
        source={{ uri: props.uri }}
        {...props}
        className="rounded-full"
      />
    </View>
  )
}
