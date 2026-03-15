import { Text, View } from 'react-native';
import './global.css'
import './i18n/config'
import 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalHost } from '@rn-primitives/portal';
 

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-blue-500">Welcome to Nativewind!</Text>
        </View>
        <PortalHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
