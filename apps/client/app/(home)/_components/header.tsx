import React from 'react'
import { Text, View } from 'react-native'
import { Bell } from 'lucide-react-native'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/clerk-expo'

export const Header = () => {
  const { signOut } = useAuth()
  const userName = 'Bruno Rodrigues'

  return (
    <View className="px-safe pt-safe w-full flex-row justify-between bg-background">
      <View className="w-full flex-row">
        <View className="flex-1 flex-row gap-2">
          <Avatar uri="https://avatars.githubusercontent.com/u/13812512?v=4" />
          <View>
            <Text className="text-slate-300">{userName}</Text>
            <Text className="text-slate-500">Welcome back</Text>
          </View>
        </View>
        <View>
          <Button variant="ghost" icon={Bell} onPress={() => signOut()} />
        </View>
      </View>
    </View>
  )
}
