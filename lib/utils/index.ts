import { clsx, type ClassValue } from 'clsx'
import { intervalToDuration } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { Dimensions, PixelRatio, StyleSheet } from 'react-native'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const numberValue = (value: number) => {
  // 1 - 999 - normal number
  // 1000 - 999999 - k
  // 1000000 - 999999999 - kk

  if (value < 1000) return value
  return `${(value / 1000).toFixed(1)}k`
}

export const secondsRemaining = (parsedDate: string) => {
  const now = new Date().getTime()
  const parsedDateTime = new Date(parsedDate).getTime()
  const miliSeconds = parsedDateTime - now
  const seconds = Math.round(miliSeconds / 1000)
  return seconds
}

export const secondsToTimeHours = (seconds: number) => {
  let secondsToParse = seconds
  if (secondsToParse === 86400) secondsToParse -= 1
  var date = new Date(0)
  date.setSeconds(secondsToParse)
  var timeString = date.toISOString().substring(11, 19)
  return timeString
}

export const secondsToDuration = (seconds: number) => {
  const duration = intervalToDuration({
    start: 0,
    end: seconds * 1000
  })

  let timeString = ''

  if (duration.days) timeString += `${duration.days}d `
  if (duration.hours) timeString += `${duration.hours}h `
  if (duration.minutes) timeString += `${duration.minutes}m`

  return timeString
}

export const getPercentageBetweenTwoDates = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()

  const now = new Date().getTime()

  const perc = (now - start) / (end - start)

  const result = perc * 100

  if (result < 0) return 0

  return result > 100 ? 100 : Math.floor(result)
}

export const getEquipmentSlot = (
  itemType: 'weapon' | 'armor' | 'offhand' | 'head' | 'legs' | 'boots' | 'ring' | 'amulet'
) => {
  switch (itemType) {
    case 'weapon':
      return 'weaponItem'
    case 'armor':
      return 'armorItem'
    case 'offhand':
      return 'offhandItem'
    case 'head':
      return 'headItem'
    case 'legs':
      return 'legsItem'
    case 'boots':
      return 'bootsItem'
    case 'ring':
      return 'ringItem'
    case 'amulet':
      return 'necklaceItem'
    default:
      return false
  }
}

// Responsive scaling utilities
const { width, height } = Dimensions.get('window')
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width]
const SCREEN_WIDTH = width
const SCREEN_HEIGHT = height

// Base dimensions (design reference iPhone 17 PRO)
const guidelineBaseWidth = 402
const guidelineBaseHeight = 874
const BASE_WIDTH = 402
const BASE_HEIGHT = 874

/**
 * Scale size based on short dimension (horizontal scaling)
 * Works consistently in both portrait and landscape
 * @param size - The base size to scale
 * @returns Scaled size for current device
 */
export const scale = (size: number): number => {
  return (shortDimension / guidelineBaseWidth) * size
}

/**
 * Scale size based on long dimension (vertical scaling)
 * Works consistently in both portrait and landscape
 * @param size - The base size to scale
 * @returns Scaled size for current device
 */
export const verticalScale = (size: number): number => {
  return (longDimension / guidelineBaseHeight) * size
}

/**
 * Moderate scale with factor (typically used for fonts)
 * Provides more gradual scaling than linear scale
 * @param size - The base size to scale
 * @param factor - Scaling factor (default 0.5)
 * @returns Moderately scaled size for current device
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor
}

/**
 * Scale text with adaptive factor based on device size
 * Uses different scaling factors depending on whether device is larger or smaller than base
 * @param size - The base size to scale
 * @returns Scaled text size with adaptive factor
 */
export const scaleText = (size: number): number => {
  const scaleFactor = shortDimension / guidelineBaseWidth
  const factor = scaleFactor > 1 ? 0.25 : 0.5
  return size + (scale(size) - size) * factor
}

/**
 * Moderate vertical scale with factor
 * Provides more gradual vertical scaling
 * @param size - The base size to scale
 * @param factor - Scaling factor (default 0.5)
 * @returns Moderately scaled size for current device
 */
export const moderateVerticalScale = (size: number, factor: number = 0.5): number => {
  return size + (verticalScale(size) - size) * factor
}


/**
 * Scale size based on screen height
 * @param size - The base size to scale
 * @returns Scaled size for current device
 */
export const scaleHeight = (size: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size)
}

// Pre-computed scale factor for scaleSize (computed once at module load)
const SCALE_SIZE_FACTOR = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT)

// Memoization cache for scaleSize results
const scaleSizeCache = new Map<number, number>()

/**
 * Scale size based on average of width and height (for uniform scaling)
 * Uses memoization to avoid recalculating the same values
 * @param size - The base size to scale
 * @returns Uniformly scaled size for current device
 */
export const scaleSize = (size: number): number => {
  const cached = scaleSizeCache.get(size)
  if (cached !== undefined) return cached
  
  const result = PixelRatio.roundToNearestPixel(SCALE_SIZE_FACTOR * size)
  scaleSizeCache.set(size, result)
  return result
}

/**
 * Pre-computed commonly used scaled values for optimal performance.
 * Use these instead of calling scaleSize() in render for maximum efficiency.
 * Values are computed once at module initialization.
 */
export const scaledValues = {
  // Common icon/sprite sizes
  s10: scaleSize(10),
  s12: scaleSize(12),
  s14: scaleSize(14),
  s16: scaleSize(16),
  s18: scaleSize(18),
  s20: scaleSize(20),
  s24: scaleSize(24),
  s28: scaleSize(28),
  s32: scaleSize(32),
  s36: scaleSize(36),
  s40: scaleSize(40),
  s44: scaleSize(44),
  s48: scaleSize(48),
  s50: scaleSize(50),
  s56: scaleSize(56),
  s60: scaleSize(60),
  s64: scaleSize(64),
  s80: scaleSize(80),
  s96: scaleSize(96),
  s100: scaleSize(100),
  s112: scaleSize(112),
  s120: scaleSize(120),
  s128: scaleSize(128),
  s150: scaleSize(150),
  s180: scaleSize(180),
  s192: scaleSize(192),
  s200: scaleSize(200),
  s250: scaleSize(250),
} as const

/**
 * Scale font size with accessibility support
 * @param size - The base font size
 * @param maxScale - Maximum scale factor (default 1.5 for accessibility)
 * @returns Scaled font size
 */
export const scaleFontSize = (size: number, maxScale: number = 1.5): number => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, maxScale)
  return PixelRatio.roundToNearestPixel(size * scale)
}

/**
 * Get device scale category
 * @returns 'small' | 'medium' | 'large' | 'xlarge'
 */
export const getDeviceScale = (): 'small' | 'medium' | 'large' | 'xlarge' => {
  if (SCREEN_WIDTH < 360) return 'small'
  if (SCREEN_WIDTH < 400) return 'medium'
  if (SCREEN_WIDTH < 480) return 'large'
  return 'xlarge'
}

/**
 * Scale based on the longer dimension (works in both orientations)
 * @param size - The base size to scale
 * @returns Scaled size based on longer dimension
 */
export const scaleLongDimension = (size: number): number => {
  const BASE_LONG = Math.max(BASE_WIDTH, BASE_HEIGHT)
  return PixelRatio.roundToNearestPixel((longDimension / BASE_LONG) * size)
}

/**
 * Generate responsive className based on device size
 * @param baseClass - Base Tailwind classes
 * @param responsiveClasses - Optional device-specific classes
 * @returns Combined className string
 */
export const getResponsiveClass = (
  baseClass: string,
  responsiveClasses?: {
    small?: string
    medium?: string
    large?: string
    xlarge?: string
  }
): string => {
  if (!responsiveClasses) return baseClass
  
  const deviceScale = getDeviceScale()
  const responsiveClass = responsiveClasses[deviceScale] || ''
  
  return cn(baseClass, responsiveClass)
}

/**
 * Create a memoized StyleSheet with scaled dimensions
 * This prevents recreating style objects on every render
 * @param width - Base width to scale
 * @param height - Base height to scale (defaults to width if not provided)
 * @returns StyleSheet with scaled width and height
 */
export const createScaledSize = (width: number, height?: number) => {
  const scaledHeight = height ?? width
  return StyleSheet.create({
    size: {
      width: scale(width),
      height: verticalScale(scaledHeight)
    }
  })
}

/**
 * Pre-computed common scaled sizes for better performance
 * Use these for frequently used sizes instead of creating new ones
 */
export const scaledSizes = StyleSheet.create({
  // Square sizes
  size0_5: { width: scale(2), height: scale(2) }, // h-0.5 w-0.5
  size1: { width: scale(4), height: scale(4) }, // h-1 w-1
  size1_5: { width: scale(6), height: scale(6) }, // h-1.5 w-1.5
  size2: { width: scale(8), height: scale(8) }, // h-2 w-2
  size2_5: { width: scale(10), height: scale(10) }, // h-2.5 w-2.5
  size3: { width: scale(12), height: scale(12) }, // h-3 w-3
  size3_5: { width: scale(14), height: scale(14) }, // h-3.5 w-3.5
  size4: { width: scale(16), height: scale(16) }, // h-4 w-4
  size5: { width: scale(20), height: scale(20) }, // h-5 w-5
  size6: { width: scale(24), height: scale(24) }, // h-6 w-6
  size7: { width: scale(28), height: scale(28) }, // h-7 w-7
  size8: { width: scale(32), height: scale(32) }, // h-8 w-8
  size9: { width: scale(36), height: scale(36) }, // h-9 w-9
  size10: { width: scale(40), height: scale(40) }, // h-10 w-10
  size11: { width: scale(44), height: scale(44) }, // h-11 w-11
  size12: { width: scale(48), height: scale(48) }, // h-12 w-12
  size14: { width: scale(56), height: scale(56) }, // h-14 w-14
  size16: { width: scale(64), height: scale(64) }, // h-16 w-16
  size20: { width: scale(80), height: scale(80) }, // h-20 w-20
  size24: { width: scale(96), height: scale(96) }, // h-24 w-24
  size28: { width: scale(112), height: scale(112) }, // h-28 w-28
  size32: { width: scale(128), height: scale(128) }, // h-32 w-32
  size36: { width: scale(144), height: scale(144) }, // h-36 w-36
  size40: { width: scale(160), height: scale(160) }, // h-40 w-40
  size44: { width: scale(176), height: scale(176) }, // h-44 w-44
  size48: { width: scale(192), height: scale(192) }, // h-48 w-48
  size52: { width: scale(208), height: scale(208) }, // h-52 w-52
  size56: { width: scale(224), height: scale(224) }, // h-56 w-56
  size60: { width: scale(240), height: scale(240) }, // h-60 w-60
  size64: { width: scale(256), height: scale(256) }, // h-64 w-64
  size72: { width: scale(288), height: scale(288) }, // h-72 w-72
  size80: { width: scale(320), height: scale(320) }, // h-80 w-80
  size96: { width: scale(384), height: scale(384) }, // h-96 w-96

  scaleSize0_5: { width: scaleSize(2), height: scaleSize(2) }, // h-0.5 w-0.5
  scaleSize1: { width: scaleSize(4), height: scaleSize(4) }, // h-1 w-1
  scaleSize1_5: { width: scaleSize(6), height: scaleSize(6) }, // h-1.5 w-1.5
  scaleSize2: { width: scaleSize(8), height: scaleSize(8) }, // h-2 w-2
  scaleSize2_5: { width: scaleSize(10), height: scaleSize(10) }, // h-2.5 w-2.5
  scaleSize3: { width: scaleSize(12), height: scaleSize(12) }, // h-3 w-3
  scaleSize3_5: { width: scaleSize(14), height: scaleSize(14) }, // h-3.5 w-3.5
  scaleSize4: { width: scaleSize(16), height: scaleSize(16) }, // h-4 w-4
  scaleSize5: { width: scaleSize(20), height: scaleSize(20) }, // h-5 w-5
  scaleSize6: { width: scaleSize(24), height: scaleSize(24) }, // h-6 w-6
  scaleSize7: { width: scaleSize(28), height: scaleSize(28) }, // h-7 w-7
  scaleSize8: { width: scaleSize(32), height: scaleSize(32) }, // h-8 w-8
  scaleSize9: { width: scaleSize(36), height: scaleSize(36) }, // h-9 w-9
  scaleSize10: { width: scaleSize(40), height: scaleSize(40) }, // h-10 w-10
  scaleSize11: { width: scaleSize(44), height: scaleSize(44) }, // h-11 w-11
  scaleSize12: { width: scaleSize(48), height: scaleSize(48) }, // h-12 w-12
  scaleSize14: { width: scaleSize(56), height: scaleSize(56) }, // h-14 w-14
  scaleSize16: { width: scaleSize(64), height: scaleSize(64) }, // h-16 w-16
  scaleSize20: { width: scaleSize(80), height: scaleSize(80) }, // h-20 w-20
  scaleSize24: { width: scaleSize(96), height: scaleSize(96) }, // h-24 w-24
  scaleSize28: { width: scaleSize(112), height: scaleSize(112) }, // h-28 w-28
  scaleSize32: { width: scaleSize(128), height: scaleSize(128) }, // h-32 w-32
  scaleSize36: { width: scaleSize(144), height: scaleSize(144) }, // h-36 w-36
  scaleSize40: { width: scaleSize(160), height: scaleSize(160) }, // h-40 w-40
  scaleSize44: { width: scaleSize(176), height: scaleSize(176) }, // h-44 w-44
  scaleSize48: { width: scaleSize(192), height: scaleSize(192) }, // h-48 w-48
  scaleSize52: { width: scaleSize(208), height: scaleSize(208) }, // h-52 w-52
  scaleSize56: { width: scaleSize(224), height: scaleSize(224) }, // h-56 w-56
  scaleSize60: { width: scaleSize(240), height: scaleSize(240) }, // h-60 w-60
  scaleSize64: { width: scaleSize(256), height: scaleSize(256) }, // h-64 w-64
  scaleSize72: { width: scaleSize(288), height: scaleSize(288) }, // h-72 w-72
  scaleSize80: { width: scaleSize(320), height: scaleSize(320) }, // h-80 w-80
  scaleSize96: { width: scaleSize(384), height: scaleSize(384) }, // h-96 w-96
  scaleSize125: { width: scaleSize(500), height: scaleSize(500) }, // h-125 w-125

  moderateSize0_5: { width: moderateScale(2), height: moderateScale(2) }, // h-0.5 w-0.5
  moderateSize1: { width: moderateScale(4), height: moderateScale(4) }, // h-1 w-1
  moderateSize1_5: { width: moderateScale(6), height: moderateScale(6) }, // h-1.5 w-1.5
  moderateSize2: { width: moderateScale(8), height: moderateScale(8) }, // h-2 w-2
  moderateSize2_5: { width: moderateScale(10), height: moderateScale(10) }, // h-2.5 w-2.5
  moderateSize3: { width: moderateScale(12), height: moderateScale(12) }, // h-3 w-3
  moderateSize3_5: { width: moderateScale(14), height: moderateScale(14) }, // h-3.5 w-3.5
  moderateSize4: { width: moderateScale(16), height: moderateScale(16) }, // h-4 w-4
  moderateSize5: { width: moderateScale(20), height: moderateScale(20) }, // h-5 w-5
  moderateSize6: { width: moderateScale(24), height: moderateScale(24) }, // h-6 w-6
  moderateSize7: { width: moderateScale(28), height: moderateScale(28) }, // h-7 w-7
  moderateSize8: { width: moderateScale(32), height: moderateScale(32) }, // h-8 w-8
  moderateSize9: { width: moderateScale(36), height: moderateScale(36) }, // h-9 w-9
  moderateSize10: { width: moderateScale(40), height: moderateScale(40) }, // h-10 w-10
  moderateSize11: { width: moderateScale(44), height: moderateScale(44) }, // h-11 w-11
  moderateSize12: { width: moderateScale(48), height: moderateScale(48) }, // h-12 w-12
  moderateSize14: { width: moderateScale(56), height: moderateScale(56) }, // h-14 w-14
  moderateSize16: { width: moderateScale(64), height: moderateScale(64) }, // h-16 w-16
  moderateSize20: { width: moderateScale(80), height: moderateScale(80) }, // h-20 w-20
  moderateSize24: { width: moderateScale(96), height: moderateScale(96) }, // h-24 w-24
  moderateSize28: { width: moderateScale(112), height: moderateScale(112) }, // h-28 w-28
  moderateSize32: { width: moderateScale(128), height: moderateScale(128) }, // h-32 w-32
  moderateSize36: { width: moderateScale(144), height: moderateScale(144) }, // h-36 w-36
  moderateSize40: { width: moderateScale(160), height: moderateScale(160) }, // h-40 w-40
  moderateSize44: { width: moderateScale(176), height: moderateScale(176) }, // h-44 w-44
  moderateSize48: { width: moderateScale(192), height: moderateScale(192) }, // h-48 w-48
  moderateSize52: { width: moderateScale(208), height: moderateScale(208) }, // h-52 w-52
  moderateSize56: { width: moderateScale(224), height: moderateScale(224) }, // h-56 w-56
  moderateSize60: { width: moderateScale(240), height: moderateScale(240) }, // h-60 w-60
  moderateSize64: { width: moderateScale(256), height: moderateScale(256) }, // h-64 w-64
  moderateSize72: { width: moderateScale(288), height: moderateScale(288) }, // h-72 w-72
  moderateSize80: { width: moderateScale(320), height: moderateScale(320) }, // h-80 w-80
  moderateSize96: { width: moderateScale(384), height: moderateScale(384) }, // h-96 w-96

  // Width only
  w0_5: { width: scale(2) },
  w1: { width: scale(4) },
  w1_5: { width: scale(6) },
  w2: { width: scale(8) },
  w2_5: { width: scale(10) },
  w3: { width: scale(12) },
  w3_5: { width: scale(14) },
  w4: { width: scale(16) },
  w5: { width: scale(20) },
  w6: { width: scale(24) },
  w7: { width: scale(28) },
  w8: { width: scale(32) },
  w9: { width: scale(36) },
  w10: { width: scale(40) },
  w11: { width: scale(44) },
  w12: { width: scale(48) },
  w14: { width: scale(56) },
  w16: { width: scale(64) },
  w20: { width: scale(80) },
  w24: { width: scale(96) },
  w28: { width: scale(112) },
  w32: { width: scale(128) },
  w36: { width: scale(144) },
  w40: { width: scale(160) },
  w44: { width: scale(176) },
  w48: { width: scale(192) },
  w52: { width: scale(208) },
  w56: { width: scale(224) },
  w60: { width: scale(240) },
  w64: { width: scale(256) },
  w72: { width: scale(288) },
  w80: { width: scale(320) },
  w96: { width: scale(384) },

  // Width only (scaleSize)
  scaleW0_5: { width: scaleSize(2) },
  scaleW1: { width: scaleSize(4) },
  scaleW1_5: { width: scaleSize(6) },
  scaleW2: { width: scaleSize(8) },
  scaleW2_5: { width: scaleSize(10) },
  scaleW3: { width: scaleSize(12) },
  scaleW3_5: { width: scaleSize(14) },
  scaleW4: { width: scaleSize(16) },
  scaleW5: { width: scaleSize(20) },
  scaleW6: { width: scaleSize(24) },
  scaleW7: { width: scaleSize(28) },
  scaleW8: { width: scaleSize(32) },
  scaleW9: { width: scaleSize(36) },
  scaleW10: { width: scaleSize(40) },
  scaleW11: { width: scaleSize(44) },
  scaleW12: { width: scaleSize(48) },
  scaleW14: { width: scaleSize(56) },
  scaleW16: { width: scaleSize(64) },
  scaleW20: { width: scaleSize(80) },
  scaleW22_5: { width: scaleSize(90) },
  scaleW24: { width: scaleSize(96) },
  scaleW28: { width: scaleSize(112) },
  scaleW32: { width: scaleSize(128) },
  scaleW36: { width: scaleSize(144) },
  scaleW40: { width: scaleSize(160) },
  scaleW44: { width: scaleSize(176) },
  scaleW48: { width: scaleSize(192) },
  scaleW52: { width: scaleSize(208) },
  scaleW56: { width: scaleSize(224) },
  scaleW60: { width: scaleSize(240) },
  scaleW64: { width: scaleSize(256) },
  scaleW72: { width: scaleSize(288) },
  scaleW80: { width: scaleSize(320) },
  scaleW96: { width: scaleSize(384) },
  scaleW125: { width: scaleSize(500) },
  

  // Height only
  h0_5: { height: verticalScale(2) },
  h1: { height: verticalScale(4) },
  h1_5: { height: verticalScale(6) },
  h2: { height: verticalScale(8) },
  h2_5: { height: verticalScale(10) },
  h3: { height: verticalScale(12) },
  h3_5: { height: verticalScale(14) },
  h4: { height: verticalScale(16) },
  h5: { height: verticalScale(20) },
  h6: { height: verticalScale(24) },
  h7: { height: verticalScale(28) },
  h8: { height: verticalScale(32) },
  h9: { height: verticalScale(36) },
  h10: { height: verticalScale(40) },
  h11: { height: verticalScale(44) },
  h12: { height: verticalScale(48) },
  h14: { height: verticalScale(56) },
  h16: { height: verticalScale(64) },
  h20: { height: verticalScale(80) },
  h24: { height: verticalScale(96) },
  h28: { height: verticalScale(112) },
  h32: { height: verticalScale(128) },
  h36: { height: verticalScale(144) },
  h40: { height: verticalScale(160) },
  h44: { height: verticalScale(176) },
  h48: { height: verticalScale(192) },
  h52: { height: verticalScale(208) },
  h56: { height: verticalScale(224) },
  h60: { height: verticalScale(240) },
  h64: { height: verticalScale(256) },
  h72: { height: verticalScale(288) },
  h80: { height: verticalScale(320) },
  h96: { height: verticalScale(384) },
  h150: { height: verticalScale(600) },

  // Height only (scaleSize)
  scaleH0_5: { height: scaleSize(2) },
  scaleH1: { height: scaleSize(4) },
  scaleH1_5: { height: scaleSize(6) },
  scaleH2: { height: scaleSize(8) },
  scaleH2_5: { height: scaleSize(10) },
  scaleH3: { height: scaleSize(12) },
  scaleH3_5: { height: scaleSize(14) },
  scaleH4: { height: scaleSize(16) },
  scaleH5: { height: scaleSize(20) },
  scaleH6: { height: scaleSize(24) },
  scaleH7: { height: scaleSize(28) },
  scaleH8: { height: scaleSize(32) },
  scaleH9: { height: scaleSize(36) },
  scaleH10: { height: scaleSize(40) },
  scaleH11: { height: scaleSize(44) },
  scaleH12: { height: scaleSize(48) },
  scaleH14: { height: scaleSize(56) },
  scaleH16: { height: scaleSize(64) },
  scaleH20: { height: scaleSize(80) },
  scaleH24: { height: scaleSize(96) },
  scaleH28: { height: scaleSize(112) },
  scaleH32: { height: scaleSize(128) },
  scaleH36: { height: scaleSize(144) },
  scaleH40: { height: scaleSize(160) },
  scaleH44: { height: scaleSize(176) },
  scaleH48: { height: scaleSize(192) },
  scaleH52: { height: scaleSize(208) },
  scaleH56: { height: scaleSize(224) },
  scaleH60: { height: scaleSize(240) },
  scaleH64: { height: scaleSize(256) },
  scaleH72: { height: scaleSize(288) },
  scaleH80: { height: scaleSize(320) },
  scaleH96: { height: scaleSize(384) },
  scaleH125: { height: scaleSize(500) },
  scaleH150: { height: scaleSize(600) },

  // Min Width
  minW0_5: { minWidth: scale(2) },
  minW1: { minWidth: scale(4) },
  minW1_5: { minWidth: scale(6) },
  minW2: { minWidth: scale(8) },
  minW2_5: { minWidth: scale(10) },
  minW3: { minWidth: scale(12) },
  minW3_5: { minWidth: scale(14) },
  minW4: { minWidth: scale(16) },
  minW5: { minWidth: scale(20) },
  minW6: { minWidth: scale(24) },
  minW7: { minWidth: scale(28) },
  minW8: { minWidth: scale(32) },
  minW9: { minWidth: scale(36) },
  minW10: { minWidth: scale(40) },
  minW11: { minWidth: scale(44) },
  minW12: { minWidth: scale(48) },
  minW14: { minWidth: scale(56) },
  minW16: { minWidth: scale(64) },
  minW20: { minWidth: scale(80) },
  minW24: { minWidth: scale(96) },
  minW28: { minWidth: scale(112) },
  minW32: { minWidth: scale(128) },
  minW36: { minWidth: scale(144) },
  minW40: { minWidth: scale(160) },
  minW44: { minWidth: scale(176) },
  minW48: { minWidth: scale(192) },
  minW52: { minWidth: scale(208) },
  minW56: { minWidth: scale(224) },
  minW60: { minWidth: scale(240) },
  minW64: { minWidth: scale(256) },
  minW72: { minWidth: scale(288) },
  minW80: { minWidth: scale(320) },
  minW96: { minWidth: scale(384) },

  // Max Width
  maxW0_5: { maxWidth: scale(2) },
  maxW1: { maxWidth: scale(4) },
  maxW1_5: { maxWidth: scale(6) },
  maxW2: { maxWidth: scale(8) },
  maxW2_5: { maxWidth: scale(10) },
  maxW3: { maxWidth: scale(12) },
  maxW3_5: { maxWidth: scale(14) },
  maxW4: { maxWidth: scale(16) },
  maxW5: { maxWidth: scale(20) },
  maxW6: { maxWidth: scale(24) },
  maxW7: { maxWidth: scale(28) },
  maxW8: { maxWidth: scale(32) },
  maxW9: { maxWidth: scale(36) },
  maxW10: { maxWidth: scale(40) },
  maxW11: { maxWidth: scale(44) },
  maxW12: { maxWidth: scale(48) },
  maxW14: { maxWidth: scale(56) },
  maxW16: { maxWidth: scale(64) },
  maxW20: { maxWidth: scale(80) },
  maxW24: { maxWidth: scale(96) },
  maxW28: { maxWidth: scale(112) },
  maxW32: { maxWidth: scale(128) },
  maxW36: { maxWidth: scale(144) },
  maxW40: { maxWidth: scale(160) },
  maxW44: { maxWidth: scale(176) },
  maxW48: { maxWidth: scale(192) },
  maxW52: { maxWidth: scale(208) },
  maxW56: { maxWidth: scale(224) },
  maxW60: { maxWidth: scale(240) },
  maxW64: { maxWidth: scale(256) },
  maxW72: { maxWidth: scale(288) },
  maxW80: { maxWidth: scale(320) },
  maxW96: { maxWidth: scale(384) },
  maxW125: { maxWidth: scale(500) },

  // Min Height
  minH0_5: { minHeight: verticalScale(2) },
  minH1: { minHeight: verticalScale(4) },
  minH1_5: { minHeight: verticalScale(6) },
  minH2: { minHeight: verticalScale(8) },
  minH2_5: { minHeight: verticalScale(10) },
  minH3: { minHeight: verticalScale(12) },
  minH3_5: { minHeight: verticalScale(14) },
  minH4: { minHeight: verticalScale(16) },
  minH5: { minHeight: verticalScale(20) },
  minH6: { minHeight: verticalScale(24) },
  minH7: { minHeight: verticalScale(28) },
  minH8: { minHeight: verticalScale(32) },
  minH9: { minHeight: verticalScale(36) },
  minH10: { minHeight: verticalScale(40) },
  minH11: { minHeight: verticalScale(44) },
  minH12: { minHeight: verticalScale(48) },
  minH14: { minHeight: verticalScale(56) },
  minH16: { minHeight: verticalScale(64) },
  minH20: { minHeight: verticalScale(80) },
  minH24: { minHeight: verticalScale(96) },
  minH28: { minHeight: verticalScale(112) },
  minH32: { minHeight: verticalScale(128) },
  minH36: { minHeight: verticalScale(144) },
  minH40: { minHeight: verticalScale(160) },
  minH44: { minHeight: verticalScale(176) },
  minH48: { minHeight: verticalScale(192) },
  minH52: { minHeight: verticalScale(208) },
  minH56: { minHeight: verticalScale(224) },
  minH60: { minHeight: verticalScale(240) },
  minH64: { minHeight: verticalScale(256) },
  minH72: { minHeight: verticalScale(288) },
  minH80: { minHeight: verticalScale(320) },
  minH96: { minHeight: verticalScale(384) },

  // Max Height
  maxH0_5: { maxHeight: verticalScale(2) },
  maxH1: { maxHeight: verticalScale(4) },
  maxH1_5: { maxHeight: verticalScale(6) },
  maxH2: { maxHeight: verticalScale(8) },
  maxH2_5: { maxHeight: verticalScale(10) },
  maxH3: { maxHeight: verticalScale(12) },
  maxH3_5: { maxHeight: verticalScale(14) },
  maxH4: { maxHeight: verticalScale(16) },
  maxH5: { maxHeight: verticalScale(20) },
  maxH6: { maxHeight: verticalScale(24) },
  maxH7: { maxHeight: verticalScale(28) },
  maxH8: { maxHeight: verticalScale(32) },
  maxH9: { maxHeight: verticalScale(36) },
  maxH10: { maxHeight: verticalScale(40) },
  maxH11: { maxHeight: verticalScale(44) },
  maxH12: { maxHeight: verticalScale(48) },
  maxH14: { maxHeight: verticalScale(56) },
  maxH16: { maxHeight: verticalScale(64) },
  maxH20: { maxHeight: verticalScale(80) },
  maxH24: { maxHeight: verticalScale(96) },
  maxH28: { maxHeight: verticalScale(112) },
  maxH32: { maxHeight: verticalScale(128) },
  maxH36: { maxHeight: verticalScale(144) },
  maxH40: { maxHeight: verticalScale(160) },
  maxH44: { maxHeight: verticalScale(176) },
  maxH48: { maxHeight: verticalScale(192) },
  maxH52: { maxHeight: verticalScale(208) },
  maxH56: { maxHeight: verticalScale(224) },
  maxH60: { maxHeight: verticalScale(240) },
  maxH64: { maxHeight: verticalScale(256) },
  maxH72: { maxHeight: verticalScale(288) },
  maxH80: { maxHeight: verticalScale(320) },
  maxH96: { maxHeight: verticalScale(384) },
  maxH150: { maxHeight: verticalScale(600) },
  maxH180: { maxHeight: verticalScale(720) },
  maxH200: { maxHeight: verticalScale(800) },
})

/**
 * Converts an API league name to a translation key
 * e.g., "Novice League" -> "NOVICE_LEAGUE"
 */
export const getLeagueTranslationKey = (leagueName: string): string => {
  if (!leagueName) return 'UNKNOWN_LEAGUE'
  return leagueName.toUpperCase().replace(/ /g, '_')
}

/**
 * Converts a location name to a translation key
 * e.g., "Cave Entrance" -> "CAVE_ENTRANCE"
 */
export const getLocationTranslationKey = (locationName: string): string => {
  if (!locationName) return 'UNKNOWN'
  return locationName.toUpperCase().replace(/ /g, '_')
}
