import { Text, View } from 'react-native'
import { Link } from 'expo-router'

export default function Page() {
  return (
    <View className="p-safe bg-background">
      <Text className="text-foreground"> Onboarding </Text>
      <View>
        <Link href="/auth/sign-in">
          <Text className="text-primary">Sign in</Text>
        </Link>
        <Link href="/auth/sign-up">
          <Text className="text-primary">Sign up</Text>
        </Link>
        <Link href="/home">
          <Text>Home up</Text>
        </Link>
        <Link href="/(tabs)">
          <Text>Tabs</Text>
        </Link>
        <Link href="/(tabs)/explore">
          <Text>Explore</Text>
        </Link>
      </View>
    </View>
  )
}
