import { Redirect, Stack } from 'expo-router'
import { Container } from '@/components/ui/Container'
import { colors } from '@/theme'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
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
