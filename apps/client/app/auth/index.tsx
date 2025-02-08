import { Button, Text, View } from 'react-native'
import { Container } from '@/components/ui/Container'

export default function Page() {
  return (
    <Container className="flex-1 bg-red-500">
      <View>
        <Text>Welcome to bolhadev.chat</Text>
        <Text>Create your account and start learng english asap</Text>
      </View>
      <Button title="Sign Up" />
      <Button title="Sign In" />
    </Container>
  )
}
