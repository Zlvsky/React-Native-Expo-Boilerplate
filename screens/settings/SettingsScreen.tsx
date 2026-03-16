import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useSessionActions, useUser } from '@/store/sessionStore'
import React, { memo, useCallback } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SettingsScreen = memo(() => {
  const user = useUser()
  const { signOut } = useSessionActions()

  const handleSignOut = useCallback(async () => {
    await signOut()
  }, [signOut])

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <View className="h-full gap-6 p-6">
        <Text variant="h2" accessible accessibilityRole="header">
          Settings
        </Text>

        {user ? (
          <View
            className="border-border rounded-lg border p-4"
            accessible
            accessibilityLabel={`Signed in as ${user.name}, ${user.email}`}>
            <Text variant="large" accessible={false}>
              {user.name}
            </Text>
            <Text variant="muted" accessible={false}>
              {user.email}
            </Text>
          </View>
        ) : null}

        <Button
          variant="destructive"
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out of your account">
          <Text>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
})

SettingsScreen.displayName = 'SettingsScreen'

export default SettingsScreen
