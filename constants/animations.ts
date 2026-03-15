import { Easing, FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated'

/**
 * Global animation constants for consistent dialog animations across the app
 * Modern snappy animation configurations inspired by Emil Kowalski's style
 */

// Dialog content animations
export const DIALOG_ENTER_ANIMATION = ZoomIn
  .delay(40)
  .duration(280)
  .easing(Easing.out(Easing.back(1.4)))
  .withInitialValues({ transform: [{ scale: 0.88 }] })

export const DIALOG_EXIT_ANIMATION = ZoomOut
  .duration(240)
  .easing(Easing.in(Easing.back(1.2)))
  .withInitialValues({ transform: [{ scale: 1 }] })

// Overlay backdrop animations
export const OVERLAY_ENTER_ANIMATION = FadeIn
  .duration(280)
  .easing(Easing.out(Easing.quad))

export const OVERLAY_EXIT_ANIMATION = FadeOut
  .duration(240)
  .easing(Easing.in(Easing.quad))

export const OVERLAY_EXIT_ANIMATION_FAST = FadeOut
  .duration(140)
  .easing(Easing.in(Easing.quad))