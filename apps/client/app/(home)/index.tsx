import { TouchableOpacity, View } from 'react-native'
import { Text } from '@/components/ui/text'
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
      <View className="gap-2">
        <Text variant="largeTitle">Large Title</Text>
        <Text variant="title1">Title 1</Text>
        <Text variant="title2">Title 2</Text>
        <Text variant="title3">Title 3</Text>
        <Text variant="headline">Headline</Text>
        <Text variant="body">Body</Text>
      </View>
      <TouchableOpacity onPress={() => signOut()}>
        <Text className="text-primary">Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}
