import * as React from 'react'
import { Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/input'
import { useSignUp } from '@clerk/clerk-expo'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [code, setCode] = React.useState('')

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Container className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-1 items-center justify-center ">
          <Text className="text-3xl text-primary">Verify your email</Text>
        </View>
        <View className="gap-4">
          <Input
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
          />
          <Button title="Verify" onPress={onVerifyPress} />
        </View>
      </View>
    </Container>
  )
}
