import React, { createContext } from 'react'
import { View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { themes } from '@/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}
export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
}>({
  theme: 'light',
})

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { colorScheme } = useColorScheme()

  return (
    <ThemeContext.Provider value={{ theme: colorScheme || 'light' }}>
      <View style={{ ...themes[colorScheme || 'light'], flex: 1 }}>
        {children}
      </View>
    </ThemeContext.Provider>
  )
}
