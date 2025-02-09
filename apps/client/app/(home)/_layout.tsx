import { Redirect, Tabs } from 'expo-router'
import { Calendar1, History, Home } from 'lucide-react-native'
import { HapticTab } from '@/components/HapticTab'
import { Avatar } from '@/components/ui/avatar'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { colors } from '@/theme'
import { useAuth } from '@clerk/clerk-expo'
import { Header } from './_components/header'

export default function Layout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/auth/sign-in'} />
  }

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: colors.dark.primary,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarIconStyle: {
          marginTop: 10,
        },
        tabBarStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        initialParams={{ title: 'Home' }}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        initialParams={{ title: 'Schedule' }}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Calendar1 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        initialParams={{ title: 'History' }}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        initialParams={{ title: 'Settings' }}
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Avatar
              size={24}
              uri="https://avatars.githubusercontent.com/u/13812512?v=4"
            />
          ),
        }}
      />
    </Tabs>
  )
}
