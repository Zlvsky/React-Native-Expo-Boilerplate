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

type SignUpNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>

const SignUpScreen = memo(() => {
  const navigation = useNavigation<SignUpNavigationProp>()
  const { signIn } = useSessionActions()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = useCallback(async () => {
    if (!name || !email || !password) return
    setIsLoading(true)
    try {
      // TODO: Replace with your real API call
      // const { token, user } = await authService.signUp(name, email, password)
      // await signIn(token, user)
      console.log('Sign up with:', name, email)
    } catch (error) {
      console.error('Sign up failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [name, email, password, signIn])

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
              Create Account
            </Text>
            <Text variant="muted">Fill in your details to get started.</Text>
          </View>

          <View className="gap-3">
            <Input
              placeholder="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              accessibilityLabel="Full name"
            />
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
              autoComplete="new-password"
              accessibilityLabel="Password"
            />
          </View>

          <View className="gap-3">
            <Button
              onPress={handleSignUp}
              disabled={isLoading || !name || !email || !password}
              accessibilityRole="button"
              accessibilityLabel="Create account">
              <Text>{isLoading ? 'Creating account...' : 'Create Account'}</Text>
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

SignUpScreen.displayName = 'SignUpScreen'

export default SignUpScreen
