import { Text, TouchableOpacity, View } from 'react-native'
import { useAuth, useUser } from '@clerk/clerk-expo'

export default function Page() {
  const { signOut } = useAuth()
  const { user } = useUser()

  return (
    <View className="flex-1 bg-background py-4">
      <Text className="text-primary">HOME</Text>
      <Text className="text-primary">
        Hello {user?.emailAddresses[0].emailAddress}
      </Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text className="text-primary">Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}
