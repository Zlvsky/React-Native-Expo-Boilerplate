import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Text as NativeText, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

const DEFAULT_ITEMS = ['🍒', '⭐', '💎', '🍀', '🔔', '🍋', '👑'] as const
const REEL_COUNT = 3
const ITEM_HEIGHT = 72
const REEL_HEIGHT = 112
const REEL_DURATIONS = [1400, 1750, 2100] as const
const REEL_TURNS = [3, 4, 5] as const

type GachaSliderProps = {
  items?: readonly string[]
  onResult?: (result: string[]) => void
}

type SpinPlan = {
  spinId: number
  startIndex: number
  targetIndex: number
}

type GachaReelProps = {
  duration: number
  fullTurns: number
  isLast: boolean
  items: readonly string[]
  onComplete: (spinId: number) => void
  plan: SpinPlan
}

const GachaReel = memo(
  ({ duration, fullTurns, isLast, items, onComplete, plan }: GachaReelProps) => {
    const itemCount = Math.max(items.length, 1)
    const distanceToTarget = (plan.targetIndex - plan.startIndex + itemCount) % itemCount
    const travelSteps = fullTurns * itemCount + distanceToTarget

    // A single cycle plus its neighboring symbols is enough. The animated
    // offset wraps at the cycle boundary, avoiding a long list of repeated views.
    const stripItems = useMemo(
      () =>
        Array.from({ length: itemCount + 3 }, (_, position) => {
          const itemIndex = (plan.startIndex + position - 1 + itemCount) % itemCount
          return items[itemIndex] ?? '❔'
        }),
      [itemCount, items, plan.startIndex]
    )

    const animatedStep = useSharedValue(0)
    const animatedStyle = useAnimatedStyle(() => {
      const wrappedStep = animatedStep.value % itemCount
      return {
        transform: [{ translateY: -(wrappedStep + 1) * ITEM_HEIGHT }]
      }
    })

    React.useEffect(() => {
      animatedStep.value = 0

      if (plan.spinId === 0) return

      animatedStep.value = withTiming(
        travelSteps,
        {
          duration,
          easing: Easing.out(Easing.cubic)
        },
        (finished) => {
          if (finished) {
            runOnJS(onComplete)(plan.spinId)
          }
        }
      )
    }, [duration, onComplete, plan.spinId, plan.targetIndex, animatedStep, travelSteps])

    return (
      <View
        className={`border-border flex-1 overflow-hidden ${isLast ? '' : 'border-r'}`}
        style={styles.reel}
      >
        <Animated.View style={[styles.strip, animatedStyle]}>
          {stripItems.map((item, position) => (
            <View key={position} style={styles.item}>
              <NativeText accessible={false} style={styles.emoji}>
                {item}
              </NativeText>
            </View>
          ))}
        </Animated.View>

        <View
          pointerEvents="none"
          className="border-primary/20 absolute inset-x-0 border-y"
          style={styles.selector}
        />
      </View>
    )
  }
)

GachaReel.displayName = 'GachaReel'

const GachaSlider = memo(({ items = DEFAULT_ITEMS, onResult }: GachaSliderProps) => {
  const itemCount = Math.max(items.length, 1)
  const initialIndexes = useMemo(
    () => Array.from({ length: REEL_COUNT }, (_, index) => index % itemCount),
    [itemCount]
  )
  const [settledIndexes, setSettledIndexes] = useState(initialIndexes)
  const [spinPlans, setSpinPlans] = useState<SpinPlan[]>(() =>
    initialIndexes.map((itemIndex) => ({
      spinId: 0,
      startIndex: itemIndex,
      targetIndex: itemIndex
    }))
  )
  const [isSpinning, setIsSpinning] = useState(false)
  const activeSpinId = useRef(0)
  const completedReels = useRef(0)
  const targetIndexes = useRef(initialIndexes)

  const handleReelComplete = useCallback(
    (spinId: number) => {
      if (spinId !== activeSpinId.current) return

      completedReels.current += 1
      if (completedReels.current === REEL_COUNT) {
        const resultIndexes = [...targetIndexes.current]
        setSettledIndexes(resultIndexes)
        setIsSpinning(false)
        onResult?.(resultIndexes.map((index) => items[index]))
      }
    },
    [items, onResult]
  )

  const spin = useCallback(() => {
    if (isSpinning || items.length === 0) return

    const spinId = activeSpinId.current + 1
    const targets = Array.from({ length: REEL_COUNT }, () =>
      Math.floor(Math.random() * items.length)
    )

    activeSpinId.current = spinId
    completedReels.current = 0
    targetIndexes.current = targets
    setIsSpinning(true)
    setSpinPlans(
      targets.map((targetIndex, reelIndex) => ({
        spinId,
        startIndex: settledIndexes[reelIndex] % items.length,
        targetIndex
      }))
    )
  }, [isSpinning, items.length, settledIndexes])

  const currentItems = useMemo(
    () => settledIndexes.map((itemIndex) => items[itemIndex % itemCount] ?? '❔'),
    [itemCount, items, settledIndexes]
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
        accessibilityLabel={
          isSpinning
            ? 'Gacha reels are spinning'
            : `Current result: ${currentItems.join(', ')}`
        }
      >
        {spinPlans.map((plan, reelIndex) => (
          <GachaReel
            key={`${reelIndex}-${plan.spinId}`}
            duration={REEL_DURATIONS[reelIndex]}
            fullTurns={REEL_TURNS[reelIndex]}
            isLast={reelIndex === REEL_COUNT - 1}
            items={items}
            onComplete={handleReelComplete}
            plan={plan}
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

const styles = StyleSheet.create({
  reel: {
    height: REEL_HEIGHT
  },
  strip: {
    paddingVertical: (REEL_HEIGHT - ITEM_HEIGHT) / 2
  },
  item: {
    alignItems: 'center',
    height: ITEM_HEIGHT,
    justifyContent: 'center'
  },
  emoji: {
    fontSize: 46,
    lineHeight: 58
  },
  selector: {
    height: ITEM_HEIGHT,
    top: (REEL_HEIGHT - ITEM_HEIGHT) / 2
  }
})
