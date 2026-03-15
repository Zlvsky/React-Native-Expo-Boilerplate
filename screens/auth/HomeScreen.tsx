import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import type { AuthStackParamList } from '@/navigation/AuthNavigator'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import React, { memo, useCallback } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type HomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Home'>

const HomeScreen = memo(() => {
  const navigation = useNavigation<HomeScreenNavigationProp>()

  const handleSignIn = useCallback(() => {
    navigation.navigate('SignIn')
  }, [navigation])

  const handleSignUp = useCallback(() => {
    navigation.navigate('SignUp')
  }, [navigation])

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-6 p-8">
        <Text variant="h1" accessible accessibilityRole="header">
          Welcome
        </Text>
        <Text variant="muted" className="text-center">
          Sign in to your account or create a new one to get started.
        </Text>
        <View className="w-full gap-3">
          <Button
            onPress={handleSignIn}
            accessibilityRole="button"
            accessibilityLabel="Sign in to your account">
            <Text>Sign In</Text>
          </Button>
          <Button
            variant="outline"
            onPress={handleSignUp}
            accessibilityRole="button"
            accessibilityLabel="Create a new account">
            <Text>Create Account</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
})

HomeScreen.displayName = 'HomeScreen'

export default HomeScreen
