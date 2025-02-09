import { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { LockKeyhole, Mail } from 'lucide-react-native'
import { Button } from '@/components/ui/button'
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
    <>
      <View className="flex-1 items-center justify-center">
        <Text className="color-primary bg-background">
          Master English, Transform Your World. The new frontier in
          collaborative learning.
        </Text>
      </View>
      <View className="gap-4 px-6">
        <Input
          icon={Mail}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter your email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <Input
          icon={LockKeyhole}
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Button title="Sign In" onPress={onSignInPress} />

        <Link href="/auth/sign-up" asChild>
          <Button variant="secondary" title="Sign Up" />
        </Link>
      </View>
    </>
  )
}
