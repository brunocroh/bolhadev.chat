import React from 'react'
import { View } from 'react-native'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/clerk-expo'

export const Header = () => {
  const { signOut } = useAuth()
  return (
    <View className="bg-green-500">
      <Button title="teste" onPress={() => signOut()} />
    </View>
  )
}
