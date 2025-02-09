import { Redirect } from 'expo-router'
import { Stack } from 'expo-router/stack'
import { Container } from '@/components/ui/container'
import { useAuth } from '@clerk/clerk-expo'
import { Header } from './_components/header'

export default function Layout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/auth/sign-in'} />
  }

  return (
    <Container className="bg-background">
      <Header />
      <Stack screenOptions={{ headerShown: false }} />
    </Container>
  )
}
