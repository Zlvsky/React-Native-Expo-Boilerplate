import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { memo } from 'react'
import { StatusBar } from 'react-native'

import CharacterScreen from '@/screens/character/CharacterScreen'
import SettingsScreen from '@/screens/settings/SettingsScreen'

export type MainTabParamList = {
  Home: undefined
  Settings: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const SCREEN_OPTIONS = {
  headerShown: false,
  tabBarShowLabel: true,
}

const MainTabNavigator = memo(() => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator screenOptions={SCREEN_OPTIONS} initialRouteName="Home">
        <Tab.Screen name="Home" component={CharacterScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </>
  )
})

MainTabNavigator.displayName = 'MainTabNavigator'

export default MainTabNavigator
