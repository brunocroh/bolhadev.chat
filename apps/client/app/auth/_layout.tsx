import { Redirect, Stack } from 'expo-router'
import { Container } from '@/components/ui/container'
import { colors } from '@/theme'
import { useAuth } from '@clerk/clerk-expo'

export const unstable_settings = {
  initialRouteName: 'sign-in',
}

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/(home)'} />
  }

  return (
    <Container className="bg-background">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.dark.background,
          },
        }}
      />
    </Container>
  )
}
