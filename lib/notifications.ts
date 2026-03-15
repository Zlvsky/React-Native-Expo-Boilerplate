import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

// Cache to prevent repeated permission requests and push token retrieval
let _permissionsCache: { granted: boolean; checkedAt: number } | null = null
let _pushTokenCache: { token: string | null; checkedAt: number } | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface NotificationOptions {
  title: string
  body: string
  data?: Record<string, any>
  sound?: boolean
  badge?: number
}

interface ScheduleOptions extends NotificationOptions {
  seconds?: number
  date?: Date
  repeats?: boolean
  identifier?: string
}

/**
 * Request notification permissions (cached to prevent spam)
 */
const requestNotificationPermissions = async (forceRefresh: boolean = false): Promise<boolean> => {
  try {
    // Check cache first (unless forced refresh)
    if (!forceRefresh && _permissionsCache) {
      const now = Date.now()
      if (now - _permissionsCache.checkedAt < CACHE_DURATION) {
        // console.log('📱 Using cached permission status:', _permissionsCache.granted)
        return _permissionsCache.granted
      }
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    const granted = finalStatus === 'granted'
    
    // Update cache
    _permissionsCache = {
      granted,
      checkedAt: Date.now()
    }

    if (!granted) {
      console.warn('Failed to get push token for push notification!')
      return false
    }

    // Configure notification channels for Android (only once per app session)
    if (Platform.OS === 'android') {
      // Only set up channels if we haven't done so recently
      await setupAndroidChannels()
    }

    // Get Expo push token (cached separately)
    await getExpoPushTokenCached()

    return true
  } catch (error) {
    console.error('Error requesting notification permissions:', error)
    // Cache the failure to prevent repeated attempts
    _permissionsCache = {
      granted: false,
      checkedAt: Date.now()
    }
    return false
  }
}

/**
 * Setup Android notification channels (separated for reusability)
 */
const setupAndroidChannels = async () => {
  try {
    // Default channel with MAX importance for real devices
    await Notifications.setNotificationChannelAsync('default', {
      name: 'General',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    })

    // High priority channel for stamina and important game events
    await Notifications.setNotificationChannelAsync('high-priority', {
      name: 'Stamina & Important Events',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      description: 'Notifications for stamina refills and important game events',
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    })

    // Medium priority channel for shop, arena, and daily reminders
    await Notifications.setNotificationChannelAsync('medium-priority', {
      name: 'Shop & Daily Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 150, 150, 150],
      lightColor: '#FF231F7C',
      description: 'Notifications for shop refreshes and daily reminders',
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    })

    // Work completion channel
    await Notifications.setNotificationChannelAsync('work-completion', {
      name: 'Work Completion',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      description: 'Notifications when work tasks are completed',
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    })
  } catch (error) {
    console.error('Error setting up Android channels:', error)
  }
}

/**
 * Get Expo push token with caching to prevent spam
 */
const getExpoPushTokenCached = async (): Promise<string | null> => {
  try {
    // Check cache first
    if (_pushTokenCache) {
      const now = Date.now()
      if (now - _pushTokenCache.checkedAt < CACHE_DURATION) {
        // console.log('📱 Using cached push token status')
        return _pushTokenCache.token
      }
    }

    // Only attempt to get push token if we're not in a production build without Firebase
    if (Constants.expoConfig?.extra?.eas?.projectId) {
      const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
      
      _pushTokenCache = {
        token: tokenResponse.data,
        checkedAt: Date.now()
      }
      
      // console.log('📱 Expo push token obtained:', tokenResponse.data)
      return tokenResponse.data
    } else {
      _pushTokenCache = {
        token: null,
        checkedAt: Date.now()
      }
      // console.log('📱 Skipping push token retrieval - no project ID configured')
      return null
    }
  } catch (error: any) {
    // Cache the error result to prevent spam
    _pushTokenCache = {
      token: null,
      checkedAt: Date.now()
    }
    
    // Only log once per cache period to prevent spam
    console.warn('📱 Push token retrieval skipped in production build:', error?.code || error?.message)
    return null
  }
}

/**
 * Production-specific notification initialization
 * Handles common issues with production Android builds
 */
const initializeProductionNotifications = async () => {
  try {
    console.log('🏭 Initializing production notifications...')
    // First ensure permissions
    const hasPermission = await requestNotificationPermissions()
    if (!hasPermission) {
      console.error('🚫 Production notifications: Permission denied')
      return false
    }

    // Additional Android production setup
    if (Platform.OS === 'android') {
      try {
        // Force recreation of notification channels with production settings
        const channels = ['default', 'high-priority', 'medium-priority', 'work-completion']
        
        for (const channelId of channels) {
          try {
            // Delete existing channel first (in case of configuration changes)
            await Notifications.deleteNotificationChannelAsync(channelId)
          } catch {
            // Ignore errors if channel doesn't exist
          }
        }

        // Recreate channels with production-optimized settings
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Game Notifications',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          enableVibrate: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          enableLights: true,
          bypassDnd: true, // Critical for production
          showBadge: true,
        })

        await Notifications.setNotificationChannelAsync('high-priority', {
          name: 'Stamina & Important Events',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          description: 'Important game notifications',
          enableVibrate: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          enableLights: true,
          bypassDnd: true,
          showBadge: true,
        })

        await Notifications.setNotificationChannelAsync('medium-priority', {
          name: 'Shop & Daily Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 150, 150, 150],
          lightColor: '#FF231F7C',
          description: 'Daily reminders and shop updates',
          enableVibrate: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          enableLights: true,
          showBadge: true,
        })

        await Notifications.setNotificationChannelAsync('work-completion', {
          name: 'Work Completion',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          description: 'Work task completion notifications',
          enableVibrate: true,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          enableLights: true,
          bypassDnd: true,
          showBadge: true,
        })

        // console.log('✅ Production Android notification channels created')
      } catch (error) {
        console.error('❌ Error setting up Android production channels:', error)
        return false
      }
    }

    // Test production notification system with minimal approach
    // console.log('🧪 Testing production notification system...')
    // const testResult = await testMinimalNotification()

  } catch (error) {
    console.error('❌ Production notification initialization failed:', error)
    return false
  }
}


/**
 * Get Expo push token (uses cached version to prevent repeated calls)
 */
const getExpoPushToken = async (): Promise<string | null> => {
  return await getExpoPushTokenCached()
}

/**
 * Get the appropriate notification channel for a notification type
 */
const getNotificationChannel = (data?: Record<string, any>): string => {
  if (!data || !data.type) {
    return 'default'
  }

  switch (data.type) {
    case 'stamina-full':
    case 'stamina-partial':
    case 'dungeon-ready':
    case 'arena-ready':
      return 'high-priority'
    
    case 'work-complete':
      return 'work-completion'
    
    case 'shop-refresh':
    case 'daily-login':
    case 'daily-quests':
      return 'medium-priority'
    
    default:
      return 'default'
  }
}

/**
 * Sanitize notification data to ensure it's serializable for Android
 */
const sanitizeNotificationData = (data: Record<string, any> = {}): Record<string, any> => {
  const sanitized: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    // Only include primitive values that Android can serialize
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value
    } else if (value === null || value === undefined) {
      // Skip null/undefined values
      continue
    } else {
      // Convert complex objects to strings
      try {
        sanitized[key] = JSON.stringify(value)
      } catch {
        // If JSON.stringify fails, convert to string
        sanitized[key] = String(value)
      }
    }
  }
  
  // console.log('🔍 Sanitized notification data:', sanitized)
  return sanitized
}

/**
 * Check permissions quickly (uses cache)
 */
const hasNotificationPermissions = async (): Promise<boolean> => {
  // Use cached permissions check to avoid repeated permission requests
  return await requestNotificationPermissions(false)
}

/**
 * Schedule an immediate notification
 */
const scheduleImmediateNotification = async (
  options: NotificationOptions
): Promise<string | null> => {
  try {
    const hasPermission = await hasNotificationPermissions()
    if (!hasPermission) return null

    // Create minimal content to avoid serialization issues
    const content: any = {
      title: options.title,
      body: options.body,
      sound: options.sound !== false,
    }

    // Add sanitized data only if it has content
    const sanitizedData = sanitizeNotificationData(options.data)
    const hasData = Object.keys(sanitizedData).length > 0
    const isAndroid = Platform.OS === 'android'
    if (hasData && !isAndroid) {
      content.data = sanitizedData
    } else if (hasData && isAndroid) {
      // console.log('ℹ️ Android: Omitting content.data on scheduled notification to avoid JSONObject serialization issues')
    }

    // Only include badge if it's a valid number
    if (typeof options.badge === 'number') {
      content.badge = options.badge
    }

    // Set appropriate notification channel for Android
    if (Platform.OS === 'android') {
      content.channelId = getNotificationChannel(content.data || {})
    }

    // console.log('🔍 Immediate notification content:', JSON.stringify(content, null, 2))

    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: null, // Immediate
    })

    return notificationId
  } catch (error) {
    console.error('Error scheduling immediate notification:', error)
    return null
  }
}

/**
 * Schedule a notification after a delay (in seconds)
 */
const scheduleDelayedNotification = async (
  options: ScheduleOptions
): Promise<string | null> => {
  try {
    const hasPermission = await hasNotificationPermissions()
    if (!hasPermission) return null

    // Android has minimum interval requirements for scheduled notifications
    const minSeconds = Platform.OS === 'android' ? 5 : 1 // Minimum 5 seconds on Android
    const adjustedSeconds = Math.max(options.seconds || 60, minSeconds)

    // Create minimal content to avoid serialization issues
    const content: any = {
      title: options.title,
      body: options.body,
      sound: options.sound !== false,
    }

    // Add sanitized data only if it has content
    const sanitizedData = sanitizeNotificationData(options.data)
    const hasData = Object.keys(sanitizedData).length > 0
    const isAndroid = Platform.OS === 'android'
    if (hasData && !isAndroid) {
      content.data = sanitizedData
    } else if (hasData && isAndroid) {
      // console.log('ℹ️ Android: Omitting content.data on scheduled notification to avoid JSONObject serialization issues')
    }

    // Only include badge if it's a valid number
    if (typeof options.badge === 'number') {
      content.badge = options.badge
    }

    // Set appropriate notification channel for Android with enhanced properties
    if (Platform.OS === 'android') {
      content.channelId = getNotificationChannel(content.data || {})
    }

    // console.log('🔍 Final notification content:', JSON.stringify(content, null, 2))

    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: adjustedSeconds,
        repeats: options.repeats || false,
      },
  identifier: options.identifier,
    })

    return notificationId
  } catch (error) {
    console.error('Error scheduling delayed notification:', error)
    return null
  }
}

/**
 * Schedule a notification at a specific date/time
 */
const scheduleNotificationAtDate = async (
  options: ScheduleOptions
): Promise<string | null> => {
  try {
    const hasPermission = await hasNotificationPermissions()
    if (!hasPermission) return null

    if (!options.date) {
      throw new Error('Date is required for scheduled notifications')
    }

    const content: any = {
      title: options.title,
      body: options.body,
      sound: options.sound !== false,
    }

    // Attach data only on non-Android to avoid serialization issue
    const sanitizedData = sanitizeNotificationData(options.data)
    const hasData = Object.keys(sanitizedData).length > 0
    const isAndroid = Platform.OS === 'android'
    if (hasData && !isAndroid) {
      content.data = sanitizedData
    } else if (hasData && isAndroid) {
      // console.log('ℹ️ Android: Omitting content.data on date-based notification to avoid JSONObject serialization issues')
    }

    // Only include badge if it's a valid number
    if (typeof options.badge === 'number') {
      content.badge = options.badge
    }

    // Set appropriate notification channel for Android
    if (Platform.OS === 'android') {
      content.channelId = getNotificationChannel(content.data)
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: options.date,
      },
  identifier: options.identifier,
    })

    return notificationId
  } catch (error) {
    console.error('Error scheduling notification at date:', error)
    return null
  }
}

/**
 * Schedule a daily notification at a specific time
 */
const scheduleDailyNotification = async (
  options: ScheduleOptions & { hour: number; minute: number }
): Promise<string | null> => {
  try {
    const hasPermission = await hasNotificationPermissions()
    if (!hasPermission) return null

    const content: any = {
      title: options.title,
      body: options.body,
      sound: options.sound !== false,
    }

    // Attach data only on non-Android to avoid serialization issue
    const sanitizedData = sanitizeNotificationData(options.data)
    const hasData = Object.keys(sanitizedData).length > 0
    const isAndroid = Platform.OS === 'android'
    if (hasData && !isAndroid) {
      content.data = sanitizedData
    } else if (hasData && isAndroid) {
      // console.log('ℹ️ Android: Omitting content.data on daily notification to avoid JSONObject serialization issues')
    }

    // Only include badge if it's a valid number
    if (typeof options.badge === 'number') {
      content.badge = options.badge
    }

    // Set appropriate notification channel for Android
    if (Platform.OS === 'android') {
      content.channelId = getNotificationChannel(content.data)
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: options.hour,
        minute: options.minute,
      },
  identifier: options.identifier,
    })

    return notificationId
  } catch (error) {
    console.error('Error scheduling daily notification:', error)
    return null
  }
}

/**
 * Cancel a specific notification by ID
 */
const cancelNotification = async (notificationId: string): Promise<boolean> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
    return true
  } catch (error) {
    console.error('Error canceling notification:', error)
    return false
  }
}

/**
 * Cancel all scheduled notifications
 */
const cancelAllNotifications = async (): Promise<boolean> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
    return true
  } catch (error) {
    console.error('Error canceling all notifications:', error)
    return false
  }
}

/**
 * Cancel notifications by identifier
 */
const cancelNotificationsByIdentifier = async (identifier: string): Promise<boolean> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
    const notificationsToCancel = scheduledNotifications.filter(
      (notification) => notification.identifier === identifier
    )

    for (const notification of notificationsToCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier)
    }

    return true
  } catch (error) {
    console.error('Error canceling notifications by identifier:', error)
    return false
  }
}

/**
 * Get all scheduled notifications
 */
const getScheduledNotifications = async (): Promise<Notifications.NotificationRequest[]> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync()
  } catch (error) {
    console.error('Error getting scheduled notifications:', error)
    return []
  }
}

/**
 * Check if a notification with specific identifier exists
 */
const hasScheduledNotification = async (identifier: string): Promise<boolean> => {
  try {
    const scheduledNotifications = await getScheduledNotifications()
    return scheduledNotifications.some((notification) => notification.identifier === identifier)
  } catch (error) {
    console.error('Error checking scheduled notification:', error)
    return false
  }
}

/**
 * Game-specific notification helpers
 */

// Stamina refill notification
const scheduleStaminaRefillNotification = async (
  refillTimeInMinutes: number
): Promise<string | null> => {
  const identifier = 'stamina-refill'
  
  // Cancel existing stamina notifications
  await cancelNotificationsByIdentifier(identifier)
  
  return scheduleDelayedNotification({
    title: '⚡ Stamina Refilled!',
    body: 'Your stamina is full and ready for adventure!',
    seconds: refillTimeInMinutes * 60,
    identifier,
    data: { type: 'stamina-refill' },
  })
}

// Daily login reminder
const scheduleDailyLoginReminder = async (): Promise<string | null> => {
  const identifier = 'daily-login'
  
  return scheduleDailyNotification({
    title: '🎮 Daily Login Reward',
    body: "Don't forget to claim your daily rewards!",
    hour: 9, // 9 AM
    minute: 0,
    identifier,
    data: { type: 'daily-login' },
  })
}

// Arena battle reminder
const scheduleArenaBattleReminder = async (
  hoursUntilReset: number
): Promise<string | null> => {
  const identifier = 'arena-battles-ready'
  
  // Cancel existing arena notifications
  await cancelNotificationsByIdentifier(identifier)
  
  return scheduleDelayedNotification({
    title: '⚔️ Arena Battles Available',
    body: 'Your arena battles have been reset. Time to fight!',
    seconds: hoursUntilReset * 60 * 60,
    identifier,
    data: { type: 'arena-ready', action: 'navigate_to_arena' },
  })
}

// Training completion notification
const scheduleTrainingCompletionNotification = async (
  trainingTimeInMinutes: number,
  trainingType: string
): Promise<string | null> => {
  const identifier = `training-${trainingType}`
  
  return scheduleDelayedNotification({
    title: '💪 Training Complete!',
    body: `Your ${trainingType} training has finished. Collect your rewards!`,
    seconds: trainingTimeInMinutes * 60,
    identifier,
    data: { type: 'training-complete', trainingType },
  })
}

// Quest completion reminder
const scheduleQuestReminderNotification = async (
  questName: string,
  reminderTimeInHours: number = 24
): Promise<string | null> => {
  const identifier = 'quest-reminder'
  
  return scheduleDelayedNotification({
    title: '📜 Quest Reminder',
    body: `Don't forget to complete your quest: ${questName}`,
    seconds: reminderTimeInHours * 60 * 60,
    identifier,
    data: { type: 'quest-reminder', questName },
  })
}

// Clear all game notifications
const clearAllGameNotifications = async (): Promise<boolean> => {
  const gameIdentifiers = [
    'stamina-refill',
    'daily-login',
    'arena-battles-ready',
    'quest-reminder'
  ]

  try {
    for (const identifier of gameIdentifiers) {
      await cancelNotificationsByIdentifier(identifier)
    }
    
    // Also clear any training notifications
    const scheduledNotifications = await getScheduledNotifications()
    const trainingNotifications = scheduledNotifications.filter(
      (notification) => notification.identifier?.startsWith('training-')
    )
    
    for (const notification of trainingNotifications) {
      await cancelNotification(notification.identifier)
    }

    return true
  } catch (error) {
    console.error('Error clearing game notifications:', error)
    return false
  }
}

/**
 * Test notification functionality (useful for debugging)
 */
const testNotification = async (): Promise<boolean> => {
  try {
    // console.log('🧪 Testing notification functionality...')
    
    const hasPermission = await hasNotificationPermissions()
    if (!hasPermission) {
      console.error('❌ No notification permissions')
      return false
    }

    // Use delayed notification like arena battle reminder for better Android compatibility
    const notificationId = await scheduleDelayedNotification({
      title: '🧪 Test Notification',
      body: 'If you see this, notifications are working! (10 second delay)',
      seconds: 10, // 10 second delay
      identifier: 'test-notification',
      data: { type: 'test' },
    })

    if (notificationId) {
      // console.log('✅ Test notification scheduled:', notificationId)
      // console.log('⏰ Notification will appear in 10 seconds')
      return true
    } else {
      console.error('❌ Failed to schedule test notification')
      return false
    }
  } catch (error) {
    console.error('❌ Test notification error:', error)
    return false
  }
}

/**
 * Comprehensive Android notification debugging
 */
const debugAndroidNotifications = async () => {
  if (Platform.OS !== 'android') {
    // console.log('📱 This debug function is for Android only')
    return
  }

  // console.log('🔍 Starting Android notification debugging...')
  
  try {
    // 1. Check permissions
    const permissions = await Notifications.getPermissionsAsync()
    // console.log('📋 Permissions:', permissions)
    
    // 2. Check scheduled notifications
    const scheduled = await getScheduledNotifications()
    // console.log('📅 Scheduled notifications:', scheduled.length)
    
    // 3. Test immediate notification first
    // console.log('🧪 Testing immediate notification...')
    const immediateResult = await scheduleImmediateNotification({
      title: '🔍 Debug: Immediate Test',
      body: 'This is an immediate notification test',
      data: { type: 'debug-immediate' }
    })
    // console.log('📱 Immediate notification result:', immediateResult)
    
    // 4. Test delayed notification
    // console.log('🧪 Testing delayed notification (15 seconds)...')
    const delayedResult = await scheduleDelayedNotification({
      title: '🔍 Debug: Delayed Test',
      body: 'This delayed notification should appear in 15 seconds',
      seconds: 15,
      identifier: 'debug-delayed',
      data: { type: 'debug-delayed' }
    })
    // console.log('📱 Delayed notification result:', delayedResult)
    
    // 5. Check Android version and provide recommendations
    // console.log('📱 Android Version:', Platform.Version)
    // console.log('💡 Android notification troubleshooting:')
    // console.log('   1. Check Settings > Apps > Realm of Dungeons > Notifications (all should be enabled)')
    // console.log('   2. Check Settings > Apps > Realm of Dungeons > Battery > Battery optimization (should be "Not optimized")')
    // console.log('   3. Check Do Not Disturb settings')
    // console.log('   4. Try restarting the app')
    // console.log('   5. Try restarting the device')
    
    return {
      permissions,
      scheduledCount: scheduled.length,
      immediateResult: !!immediateResult,
      delayedResult: !!delayedResult,
      androidVersion: Platform.Version
    }
  } catch (error) {
    console.error('❌ Debug failed:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Get detailed notification status for debugging
 */
const getNotificationStatus = async () => {
  try {
    const permissions = await Notifications.getPermissionsAsync()
    const scheduled = await getScheduledNotifications()
    
    const status = {
      permissions: permissions.status,
      canAskAgain: permissions.canAskAgain,
      granted: permissions.granted,
      scheduledCount: scheduled.length,
      scheduledNotifications: scheduled.map(n => ({
        identifier: n.identifier,
        trigger: n.trigger,
        content: {
          title: n.content.title,
          body: n.content.body,
          data: n.content.data
        }
      })),
      platform: Platform.OS,
      // Android-specific debugging
      ...(Platform.OS === 'android' && {
        androidVersion: Platform.Version,
        androidDetails: {
          needsBatteryOptimizationCheck: true,
          recommendedActions: [
            'Check if app is battery optimized in Settings > Apps > Realm of Dungeons > Battery',
            'Check notification settings in Settings > Apps > Realm of Dungeons > Notifications',
            'Check Do Not Disturb settings',
            'Check if Auto-start is enabled for the app'
          ]
        }
      })
    }
    
    // console.log('📱 Notification Status:', JSON.stringify(status, null, 2))
    return status
  } catch (error) {
    console.error('❌ Error getting notification status:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      permissions: 'unknown',
      scheduledCount: 0,
      platform: Platform.OS
    }
  }
}

export default {
  requestPermissions: requestNotificationPermissions,
  initializeProduction: initializeProductionNotifications,
  getExpoPushToken: getExpoPushToken,
  scheduleImmediate: scheduleImmediateNotification,
  scheduleDelayed: scheduleDelayedNotification,
  scheduleAtDate: scheduleNotificationAtDate,
  scheduleDaily: scheduleDailyNotification,
  cancel: cancelNotification,
  cancelAll: cancelAllNotifications,
  cancelByIdentifier: cancelNotificationsByIdentifier,
  getScheduled: getScheduledNotifications,
  hasScheduled: hasScheduledNotification,
  
  // Debug helpers
  test: testNotification,
  getStatus: getNotificationStatus,
  debugAndroid: debugAndroidNotifications,
  
  // Production helpers
  initProduction: initializeProductionNotifications,
  getPushToken: getExpoPushToken,
  
  // Game-specific helpers
  game: {
    staminaRefill: scheduleStaminaRefillNotification,
    dailyLogin: scheduleDailyLoginReminder,
    arenaBattles: scheduleArenaBattleReminder,
    trainingComplete: scheduleTrainingCompletionNotification,
    questReminder: scheduleQuestReminderNotification,
    clearAll: clearAllGameNotifications,
  }
}
