import NotificationUtils from '@/utils/notifications'
import { 
  GAME_NOTIFICATIONS, 
  NOTIFICATION_CATEGORIES, 
  NotificationTimingHelpers
} from '@/constants/notifications'
import { STAMINA_CONFIG } from '@/constants/config'
import i18n from '@/i18n/config'

export class GameNotificationManager {
  /**
   * Schedule a predefined game notification
   */
  static async scheduleGameNotification(
    notificationKey: keyof typeof GAME_NOTIFICATIONS,
    customData?: Record<string, any>,
    customTiming?: { seconds?: number; date?: Date },
    customIdentifier?: string
  ): Promise<string | null> {
    const notification = GAME_NOTIFICATIONS[notificationKey]
    if (!notification) {
      console.error(`Notification ${notificationKey} not found`)
      return null
    }

    const options = {
      title: i18n.t(notification.titleKey),
      body: i18n.t(notification.bodyKey),
      identifier: customIdentifier ?? notification.identifier,
      sound: notification.sound,
      data: { ...notification.data, ...customData },
    }

    // Use custom timing if provided, otherwise use notification's default timing
    const timing = customTiming || notification.timing

    if (!timing) {
      // Schedule immediate notification if no timing specified
      return NotificationUtils.scheduleImmediate(options)
    }

    // Check if it's the default notification timing (has type property) or custom timing
    if ('type' in timing) {
      // It's a default notification timing with type
      switch (timing.type) {
        case 'delayed':
          return NotificationUtils.scheduleDelayed({
            ...options,
            seconds: timing.seconds || 60,
          })

        case 'daily': {
          const dailyTiming = timing as any // Type assertion for notification timing
          return NotificationUtils.scheduleDaily({
            ...options,
            hour: dailyTiming.hour || 9,
            minute: dailyTiming.minute || 0,
          })
        }

        case 'date':
          if (!timing.date) {
            console.error('Date is required for date-based notifications')
            return null
          }
          return NotificationUtils.scheduleAtDate({
            ...options,
            date: timing.date,
          })

        case 'interval':
          return NotificationUtils.scheduleDelayed({
            ...options,
            seconds: timing.seconds || 60,
            repeats: true,
          })

        default:
          return NotificationUtils.scheduleImmediate(options)
      }
    } else {
      // It's custom timing (simple object with seconds or date)
      if (timing.date) {
        return NotificationUtils.scheduleAtDate({
          ...options,
          date: timing.date,
        })
      } else if (timing.seconds) {
        return NotificationUtils.scheduleDelayed({
          ...options,
          seconds: timing.seconds,
        })
      } else {
        return NotificationUtils.scheduleImmediate(options)
      }
    }
  }

  /**
   * Schedule stamina-related notifications
   */
  static async scheduleStaminaNotifications(currentStamina: number, isPremium: boolean = false) {
    // Cancel existing stamina notifications
    await NotificationUtils.cancelByIdentifier('stamina-full')
    await NotificationUtils.cancelByIdentifier('stamina-partial-refill')

    const config = isPremium ? STAMINA_CONFIG.PREMIUM_ACCOUNT : STAMINA_CONFIG.FREE_ACCOUNT
    
    // If stamina is already full, no notifications needed
    if (currentStamina >= config.MAX_STAMINA) {
      return null
    }

    const partialRefillTimeSeconds = NotificationTimingHelpers.getPartialStaminaRefillTime(currentStamina, isPremium)
    const fullRefillTimeSeconds = NotificationTimingHelpers.getFullStaminaRefillTime(currentStamina, isPremium)

    // Schedule partial refill notification (next regen chunk)
    if (partialRefillTimeSeconds > 0) {
      await this.scheduleGameNotification('STAMINA_PARTIAL_REFILL', {
        stamina_after: Math.min(currentStamina + config.REGEN_CHUNK, config.MAX_STAMINA)
      }, { seconds: partialRefillTimeSeconds })
    }

    // Schedule full refill notification only if it's different from partial refill timing
    if (fullRefillTimeSeconds > 0 && fullRefillTimeSeconds !== partialRefillTimeSeconds) {
      await this.scheduleGameNotification('STAMINA_FULL', {
        stamina_after: config.MAX_STAMINA
      }, { seconds: fullRefillTimeSeconds })
    }

    return {
      partialRefillIn: partialRefillTimeSeconds,
      fullRefillIn: fullRefillTimeSeconds,
      scheduledPartial: partialRefillTimeSeconds > 0,
      scheduledFull: fullRefillTimeSeconds > 0 && fullRefillTimeSeconds !== partialRefillTimeSeconds
    }
  }

  /**
   * Schedule work completion notification
   */
  static async scheduleWorkNotification(workType: string, startedAt: string, endedAt: string) {
    const completionTimeSeconds = NotificationTimingHelpers.getWorkCompletionTime(startedAt, endedAt)
    
    if (completionTimeSeconds <= 0) {
      // Work is already completed
      return null
    }

    // Cancel existing work notifications
    await NotificationUtils.cancelByIdentifier('work-completed')
    
    // Schedule completion notification
    return this.scheduleGameNotification('WORK_COMPLETED', { workType }, { seconds: completionTimeSeconds })
  }

  /**
   * Cancel work notifications (when work is cancelled)
   */
  static async cancelWorkNotifications() {
    await NotificationUtils.cancelByIdentifier('work-completed')
    await NotificationUtils.cancelByIdentifier('work-almost-done')
  }

  /**
   * Schedule shop refresh notification (daily at 23:00 UTC)
   */
  static async scheduleShopRefreshNotification() {
    const refreshDate = NotificationTimingHelpers.getNextShopRefreshTime()
    return this.scheduleGameNotification('SHOP_REFRESH_AVAILABLE', {}, { date: refreshDate })
  }

  /**
   * Schedule arena battle reset notification
   */
  static async scheduleArenaBattleNotification() {
    // Cancel existing arena notifications first
    await NotificationUtils.cancelByIdentifier('arena-battles-ready')
    
    // Use the notification's default timing (10 minutes)
    return this.scheduleGameNotification('ARENA_BATTLES_READY')
  }

  /**
   * Schedule dungeon energy reset notification
   */
  static async scheduleDungeonEnergyNotification() {
    const resetTimeSeconds = NotificationTimingHelpers.getDungeonEnergyResetTime()
    return this.scheduleGameNotification('DUNGEON_ENERGY_READY', {}, { seconds: resetTimeSeconds })
  }

  /**
   * Schedule depths energy reset notification
   */
  static async scheduleDepthsEnergyNotification() {
    const resetTimeSeconds = NotificationTimingHelpers.getDepthsEnergyResetTime()
    return this.scheduleGameNotification('DEPTHS_ENERGY_READY', {}, { seconds: resetTimeSeconds })
  }

  /**
   * Schedule guild war cooldown notification
   */
  static async scheduleGuildWarCooldownNotification(cooldownEndsAt: string) {
    // Cancel existing guild war cooldown notifications
    await NotificationUtils.cancelByIdentifier('guild-war-cooldown-ready')
    
    const cooldownDate = new Date(cooldownEndsAt)
    const now = new Date()
    
    // Only schedule if the cooldown is in the future
    if (cooldownDate > now) {
      return this.scheduleGameNotification('GUILD_WAR_COOLDOWN_READY', {}, { date: cooldownDate })
    }
    
    return null
  }

  /**
   * Schedule expedition completion notification
   */
  static async scheduleExpeditionNotification(endsAt: string) {
    // Cancel existing expedition notifications
    await NotificationUtils.cancelByIdentifier('expedition-finished')
    
    const expeditionEndDate = new Date(endsAt)
    const now = new Date()
    
    // Only schedule if the expedition ends in the future
    if (expeditionEndDate > now) {
      return this.scheduleGameNotification('EXPEDITION_FINISHED', {}, { date: expeditionEndDate })
    }
    
    return null
  }

  /**
   * Cancel expedition notifications (when expedition is cancelled or completed)
   */
  static async cancelExpeditionNotifications() {
    await NotificationUtils.cancelByIdentifier('expedition-finished')
  }

  /**
   * Schedule a homestead activity completion notification.
   * Uses a per-worker identifier for worker activities to support multiple concurrent workers.
   */
  static async scheduleActivityNotification(
    endsAt: string,
    activityType: string,
    workerId?: string
  ): Promise<string | null> {
    const endDate = new Date(endsAt)
    const now = new Date()
    if (endDate <= now) return null

    if (workerId) {
      const identifier = `homestead-worker-activity-${workerId}`
      await NotificationUtils.cancelByIdentifier(identifier)
      return this.scheduleGameNotification(
        'HOMESTEAD_WORKER_ACTIVITY_FINISHED',
        { activityType, workerId },
        { date: endDate },
        identifier
      )
    }

    // Character's own activity — fixed identifier (only one at a time)
    await NotificationUtils.cancelByIdentifier(
      GAME_NOTIFICATIONS.HOMESTEAD_ACTIVITY_FINISHED.identifier
    )
    return this.scheduleGameNotification(
      'HOMESTEAD_ACTIVITY_FINISHED',
      { activityType },
      { date: endDate }
    )
  }

  /**
   * Cancel a homestead activity notification.
   * Pass workerId to cancel a specific worker's notification.
   */
  static async cancelActivityNotification(workerId?: string): Promise<void> {
    const identifier = workerId
      ? `homestead-worker-activity-${workerId}`
      : GAME_NOTIFICATIONS.HOMESTEAD_ACTIVITY_FINISHED.identifier
    await NotificationUtils.cancelByIdentifier(identifier)
  }

  /**
   * Schedule a building upgrade completion notification.
   * Uses a per-building identifier so multiple upgrades can coexist.
   */
  static async scheduleBuildingNotification(
    buildingType: string,
    endsAt: string
  ): Promise<string | null> {
    const identifier = `homestead-building-${buildingType}`
    await NotificationUtils.cancelByIdentifier(identifier)

    const endDate = new Date(endsAt)
    const now = new Date()
    if (endDate <= now) return null

    return this.scheduleGameNotification(
      'HOMESTEAD_BUILDING_UPGRADE_FINISHED',
      { buildingType },
      { date: endDate },
      identifier
    )
  }

  /**
   * Cancel a building upgrade notification (on complete or cancel).
   */
  static async cancelBuildingNotification(buildingType: string): Promise<void> {
    const identifier = `homestead-building-${buildingType}`
    await NotificationUtils.cancelByIdentifier(identifier)
  }

  /**
   * Schedule all daily notifications
   */
  static async scheduleDailyNotifications() {
    // Schedule daily login reminder
    // await this.scheduleGameNotification('DAILY_LOGIN_REMINDER')
    
    // Schedule daily quest reminder
    // await this.scheduleGameNotification('DAILY_QUEST_REMINDER')
    
    // Schedule shop refresh
    await this.scheduleShopRefreshNotification()
  }

  /**
   * Get all scheduled notifications grouped by category
   */
  static async getScheduledNotificationsByCategory() {
    const scheduledNotifications = await NotificationUtils.getScheduled()
    const categorized: Record<string, any[]> = {}

    for (const category of Object.keys(NOTIFICATION_CATEGORIES)) {
      categorized[category] = []
    }

    scheduledNotifications.forEach(notification => {
      // Find the notification definition
      const gameNotification = Object.values(GAME_NOTIFICATIONS).find(
        def => def.identifier === notification.identifier
      )

      if (gameNotification) {
        categorized[gameNotification.category].push({
          ...notification,
          definition: gameNotification,
        })
      } else {
        // Handle custom notifications
        categorized['other'] = categorized['other'] || []
        categorized['other'].push(notification)
      }
    })

    return categorized
  }

  /**
   * Clear all notifications for a specific category
   */
  static async clearCategoryNotifications(category: keyof typeof NOTIFICATION_CATEGORIES) {
    const notifications = Object.values(GAME_NOTIFICATIONS).filter(
      notification => notification.category === category
    )

    for (const notification of notifications) {
      await NotificationUtils.cancelByIdentifier(notification.identifier)
    }
  }

  /**
   * Clear all game notifications
   */
  static async clearAllGameNotifications() {
    for (const notification of Object.values(GAME_NOTIFICATIONS)) {
      await NotificationUtils.cancelByIdentifier(notification.identifier)
    }
  }

  /**
   * Clear specific game notification
   */
  static async clearNotification(notificationKey: keyof typeof GAME_NOTIFICATIONS) {
    const notification = GAME_NOTIFICATIONS[notificationKey]
    if (!notification) return
    const scheduled = await this.isNotificationScheduled(notificationKey)
    if (scheduled) {
      await NotificationUtils.cancelByIdentifier(notification.identifier)
    }
  }

  /**
   * Check if a specific game notification is scheduled
   */
  static async isNotificationScheduled(notificationKey: keyof typeof GAME_NOTIFICATIONS): Promise<boolean> {
    const notification = GAME_NOTIFICATIONS[notificationKey]
    if (!notification) return false

    return NotificationUtils.hasScheduled(notification.identifier)
  }

  /**
   * Reschedule notifications based on game state
   */
  static async rescheduleBasedOnGameState(gameState: {
    stamina?: number
    isPremium?: boolean
    currentWork?: { startedAt: string; endedAt: string; type: string }
    arenaResetTime?: number
    dungeonResetTime?: number
  }) {
    // Reschedule stamina notifications
    if (gameState.stamina !== undefined) {
      await this.scheduleStaminaNotifications(gameState.stamina, gameState.isPremium)
    }

    // Reschedule work notifications
    if (gameState.currentWork) {
      await this.scheduleWorkNotification(
        gameState.currentWork.type,
        gameState.currentWork.startedAt,
        gameState.currentWork.endedAt
      )
    }

    // Reschedule arena notifications
    if (gameState.arenaResetTime) {
      await this.scheduleGameNotification('ARENA_BATTLES_READY', {}, { seconds: gameState.arenaResetTime })
    }

    // Reschedule dungeon notifications
    if (gameState.dungeonResetTime) {
      await this.scheduleGameNotification('DUNGEON_ENERGY_READY', {}, { seconds: gameState.dungeonResetTime })
    }
  }
}