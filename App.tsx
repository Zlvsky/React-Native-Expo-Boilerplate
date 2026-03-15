import 'react-native-reanimated'
import './global.css'
import './i18n/config'

import { ThemeProvider } from '@/contexts/theme-context'
import RootNavigator from '@/navigation/RootNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <PortalHost />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
