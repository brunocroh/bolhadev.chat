import React from 'react'
import { View } from 'react-native'
import { Bell } from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useAuth } from '@clerk/clerk-expo'
import { useRoute } from '@react-navigation/native'

const ROUTE_TITLES = {
  index: 'Home',
  history: 'History',
  schedule: 'Schedule',
  settings: 'Settings',
}

export const Header = () => {
  const route = useRoute()
  const title = ROUTE_TITLES[route.name as keyof typeof ROUTE_TITLES]
  const { signOut } = useAuth()

  return (
    <View className="px-safe pt-safe w-full flex-row justify-between bg-background">
      <View className="w-full flex-row">
        <View className="flex-1 flex-row items-center gap-2">
          <Text variant="title2" className="text-slate-300">
            {title}
          </Text>
        </View>
        <View>
          <Button variant="ghost" icon={Bell} onPress={() => signOut()} />
        </View>
      </View>
    </View>
  )
}
