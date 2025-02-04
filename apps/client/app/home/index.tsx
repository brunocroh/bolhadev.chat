import { Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { Container } from '@/components/ui/Container'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'

export default function Page() {
  const { signOut } = useAuth()
  const { user } = useUser()

  return (
    <Container className="bg-green-500">
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Text>Sign out</Text>
        </TouchableOpacity>
      </SignedIn>
      <SignedOut>
        <Link href="/auth/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/auth/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </Container>
  )
}
