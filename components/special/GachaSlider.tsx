import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

const DEFAULT_ITEMS = ['🍒', '⭐', '💎', '🍀', '🔔', '🍋', '👑'] as const
const REEL_COUNT = 3

type GachaSliderProps = {
  items?: readonly string[]
  onResult?: (result: string[]) => void
}

type ReelState = {
  itemIndex: number
  revision: number
}

type GachaReelProps = {
  item: string
  revision: number
  isLast: boolean
}

const GachaReel = memo(({ item, revision, isLast }: GachaReelProps) => {
  const progress = useSharedValue(1)

  useEffect(() => {
    progress.value = 0
    progress.value = withTiming(1, {
      duration: 90,
      easing: Easing.out(Easing.cubic)
    })
  }, [progress, revision])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: -18 + progress.value * 18 },
      { scale: 0.82 + progress.value * 0.18 }
    ]
  }))

  return (
    <View
      className={`border-border h-24 flex-1 items-center justify-center ${
        isLast ? '' : 'border-r'
      }`}
    >
      <Animated.Text style={[{ fontSize: 46 }, animatedStyle]}>{item}</Animated.Text>
    </View>
  )
})

GachaReel.displayName = 'GachaReel'

const GachaSlider = memo(({ items = DEFAULT_ITEMS, onResult }: GachaSliderProps) => {
  const [reels, setReels] = useState(() =>
    Array.from<unknown, ReelState>({ length: REEL_COUNT }, (_, itemIndex) => ({
      itemIndex,
      revision: 0
    }))
  )
  const [isSpinning, setIsSpinning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const spin = useCallback(() => {
    if (isSpinning || items.length === 0) return

    clearTimers()
    setIsSpinning(true)

    const finalResult = Array.from({ length: REEL_COUNT }, () =>
      Math.floor(Math.random() * items.length)
    )
    let stoppedReels = 0

    finalResult.forEach((finalItem, reelIndex) => {
      const totalSteps = 14 + reelIndex * 5

      const advance = (step: number) => {
        setReels((current) => {
          const next = [...current]
          next[reelIndex] = {
            itemIndex:
              step === totalSteps
                ? finalItem
                : (current[reelIndex].itemIndex + 1) % items.length,
            revision: current[reelIndex].revision + 1
          }
          return next
        })

        if (step === totalSteps) {
          stoppedReels += 1
          if (stoppedReels === REEL_COUNT) {
            setIsSpinning(false)
            onResult?.(finalResult.map((index) => items[index]))
          }
          return
        }

        const delay = 55 + Math.pow(step / totalSteps, 3) * 180
        const timer = setTimeout(() => advance(step + 1), delay)
        timers.current.push(timer)
      }

      const timer = setTimeout(() => advance(0), reelIndex * 100)
      timers.current.push(timer)
    })
  }, [clearTimers, isSpinning, items, onResult])

  const currentItems = reels.map(
    ({ itemIndex }) => items[itemIndex % Math.max(items.length, 1)] ?? '❔'
  )

  return (
    <View className="border-primary/40 bg-card gap-5 rounded-2xl border p-5 shadow-sm shadow-black/5">
      <View className="gap-1">
        <Text variant="h3">Lucky draw</Text>
        <Text variant="muted">Spin all three reels and see where they land.</Text>
      </View>

      <View
        className="bg-background border-border flex-row overflow-hidden rounded-xl border p-2"
        accessible
        accessibilityLabel={`Current result: ${currentItems.join(', ')}`}
      >
        {reels.map((reel, reelIndex) => (
          <GachaReel
            key={reelIndex}
            item={currentItems[reelIndex]}
            revision={reel.revision}
            isLast={reelIndex === REEL_COUNT - 1}
          />
        ))}
      </View>

      <Button
        onPress={spin}
        disabled={isSpinning || items.length === 0}
        accessibilityLabel={
          isSpinning ? 'Gacha reels are spinning' : 'Spin the gacha reels'
        }
      >
        <Text>{isSpinning ? 'Spinning…' : 'Spin'}</Text>
      </Button>
    </View>
  )
})

GachaSlider.displayName = 'GachaSlider'

export { GachaSlider }
export type { GachaSliderProps }
