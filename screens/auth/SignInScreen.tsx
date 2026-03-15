import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import type { AuthStackParamList } from '@/navigation/AuthNavigator'
import { useSessionActions } from '@/store/sessionStore'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import React, { memo, useCallback, useState } from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type SignInNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>

const SignInScreen = memo(() => {
  const navigation = useNavigation<SignInNavigationProp>()
  const { signIn } = useSessionActions()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = useCallback(async () => {
    if (!email || !password) return
    setIsLoading(true)
    try {
      // TODO: Replace with your real API call
      // const { token, user } = await authService.signIn(email, password)
      // await signIn(token, user)
      console.log('Sign in with:', email)
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [email, password, signIn])

  const handleGoBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 justify-center gap-6 p-8">
          <View className="gap-1">
            <Text variant="h2" accessible accessibilityRole="header">
              Sign In
            </Text>
            <Text variant="muted">Enter your credentials to continue.</Text>
          </View>

          <View className="gap-3">
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="Email address"
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              accessibilityLabel="Password"
            />
          </View>

          <View className="gap-3">
            <Button
              onPress={handleSignIn}
              disabled={isLoading || !email || !password}
              accessibilityRole="button"
              accessibilityLabel="Sign in">
              <Text>{isLoading ? 'Signing in...' : 'Sign In'}</Text>
            </Button>
            <Button
              variant="ghost"
              onPress={handleGoBack}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Text>Go Back</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
})

SignInScreen.displayName = 'SignInScreen'

export default SignInScreen
