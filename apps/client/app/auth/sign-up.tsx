import * as React from 'react'
import { Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/Container'
import { Input } from '@/components/ui/input'
import { useSignUp } from '@clerk/clerk-expo'

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      router.push('/auth/verify-otp')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Container className="flex-1 bg-background">
      <View className="flex-1">
        <View>
          <Button title="back" onPress={() => router.back()} />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-3xl text-primary">Sign up</Text>
        </View>
      </View>
      <View className="gap-4">
        <Input
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <Input
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <Button title="Continue" onPress={onSignUpPress} />
      </View>
    </Container>
  )
}
