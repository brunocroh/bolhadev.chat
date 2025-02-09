import React from 'react'
import { ImageProps, View } from 'react-native'

type AvatarProps = {
  uri: string
} & ImageProps

export const Avatar = (props: AvatarProps) => {
  return (
    <View className="rounded-full bg-secondary p-0.5">
      <img
        width={32}
        height={32}
        src={props.uri}
        {...props}
        className="rounded-full"
      />
    </View>
  )
}
