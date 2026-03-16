import React, { memo } from 'react'
import { ActivityIndicator, View } from 'react-native'

const LoadingScreen = memo(() => {
  return (
    <View
      className="h-full items-center justify-center bg-background"
      accessible
      accessibilityLabel="Loading">
      <ActivityIndicator size="large" />
    </View>
  )
})

LoadingScreen.displayName = 'LoadingScreen'

export default LoadingScreen
