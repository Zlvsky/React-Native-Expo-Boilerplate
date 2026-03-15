import { Text } from '@/components/ui/text'
import { useUser } from '@/store/sessionStore'
import React, { memo } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const CharacterScreen = memo(() => {
  const user = useUser()

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4 p-6">
        <Text variant="h2" accessible accessibilityRole="header">
          Home
        </Text>
        {user ? (
          <Text variant="muted" accessible accessibilityLabel={`Welcome back, ${user.name}`}>
            Welcome back, {user.name}!
          </Text>
        ) : (
          <Text variant="muted">You are now signed in.</Text>
        )}
      </View>
    </SafeAreaView>
  )
})

CharacterScreen.displayName = 'CharacterScreen'

export default CharacterScreen
