import { memo } from 'react'
import { ActivityIndicator, View } from 'react-native'

const LoadingScreen = memo(() => {
  return (
    <View
      className="bg-background h-full items-center justify-center"
      accessible
      accessibilityLabel="Loading"
    >
      <ActivityIndicator size="large" />
    </View>
  )
})

LoadingScreen.displayName = 'LoadingScreen'

export default LoadingScreen
