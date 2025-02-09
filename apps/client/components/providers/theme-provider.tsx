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
  const { colorScheme, setColorScheme } = useColorScheme()
  setColorScheme('dark')

  return (
    <ThemeContext.Provider value={{ theme: colorScheme || 'dark' }}>
      <View style={{ ...themes['dark'], flex: 1 }}>{children}</View>
    </ThemeContext.Provider>
  )
}
