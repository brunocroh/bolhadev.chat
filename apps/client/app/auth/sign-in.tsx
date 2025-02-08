import { useCallback, useState } from 'react'
import { Button, Text, View } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Camera } from 'lucide-react-native'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/input'
import { useSignIn } from '@clerk/clerk-expo'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, signIn, emailAddress, password, setActive, router])

  return (
    <Container className="flex-1 bg-background">
      <View className="flex-1">
        <Text>
          Master English, Transform Your World. The new frontier in
          collaborative learning.
        </Text>
      </View>
      <View className="gap-2">
        <Input
          icon={Camera}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter your email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <Input
          icon={Camera}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Button title="Sign in" onPress={onSignInPress} />
        <View>
          <Text>Don't have an account?</Text>
          <Link href="/auth/sign-up">
            <Text>Sign up</Text>
          </Link>
        </View>
      </View>
    </Container>
  )
}
