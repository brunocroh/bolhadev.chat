import { useEffect } from 'react'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { tokenCache } from '@/cache'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import '../global.css'

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  initialRouteName: '(intro)',
}

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

  if (!publishableKey) {
    throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ')
  }

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const { setColorScheme, colorScheme } = useColorScheme()

  setColorScheme(colorScheme || 'light')

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
          <ClerkLoaded>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(intro)" />
              <Stack.Screen name="home" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ClerkLoaded>
        </ClerkProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}
