import './global.css'
import './i18n/config'
import 'react-native-reanimated'

import { NavigationContainer } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigator from '@/navigation/RootNavigator'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <PortalHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
