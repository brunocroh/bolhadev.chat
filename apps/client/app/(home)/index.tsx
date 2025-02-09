import { Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'

export default function Page() {
  const { signOut } = useAuth()
  const { user } = useUser()

  return (
    <>
      <SignedIn>
        <Text className="text-primary">
          Hello {user?.emailAddresses[0].emailAddress}
        </Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Text className="text-primary">Sign out</Text>
        </TouchableOpacity>
      </SignedIn>
      <SignedOut>
        <Link href="/auth/sign-in">
          <Text className="primary">Sign in</Text>
        </Link>
        <Link href="/auth/sign-up">
          <Text>Sign up</Text>
        </Link>
        <TouchableOpacity onPress={() => signOut()}>
          <Text>Sign out</Text>
        </TouchableOpacity>
      </SignedOut>
    </>
  )
}
