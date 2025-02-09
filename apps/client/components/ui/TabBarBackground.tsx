import { View } from 'react-native'

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  return <View className="bg-background" />
}

export function useBottomTabOverflow() {
  return 0
}
