import React from 'react'
import { Image, ImageProps, View } from 'react-native'

type AvatarProps = {} & ImageProps

export const Avatar = (props: AvatarProps) => {
  return (
    <View className="rounded-full bg-secondary p-0.5">
      <Image width={32} height={32} {...props} className="rounded-full" />
    </View>
  )
}
