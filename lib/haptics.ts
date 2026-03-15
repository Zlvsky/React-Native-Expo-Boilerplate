import * as Haptics from 'expo-haptics'
import { useUserPreferencesStore } from '@/store/userPreferencesStore'

export const triggerHaptic = (style: Haptics.ImpactFeedbackStyle) => {
  const { hapticsEnabled } = useUserPreferencesStore.getState()
  if (hapticsEnabled) {
    Haptics.impactAsync(style)
  }
}

export const triggerNotification = (type: Haptics.NotificationFeedbackType) => {
  const { hapticsEnabled } = useUserPreferencesStore.getState()
  if (hapticsEnabled) {
    Haptics.notificationAsync(type)
  }
}
