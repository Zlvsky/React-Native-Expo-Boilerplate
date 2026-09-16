const { getDefaultConfig } = require('expo/metro-config')
const { withNativewind } = require('nativewind/metro')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)
const nativewindConfig = withNativewind(config, { input: './global.css', inlineRem: 16 })

// react-native-css needs async bundle paths during native release exports.
const defaultCustomSerializer = nativewindConfig.serializer?.customSerializer

if (defaultCustomSerializer) {
  nativewindConfig.serializer.customSerializer = (
    entryPoint,
    preModules,
    graph,
    options
  ) => {
    const platform = graph.transformOptions?.platform
    const isNativePlatform = platform === 'android' || platform === 'ios'

    return defaultCustomSerializer(entryPoint, preModules, graph, {
      ...options,
      includeAsyncPaths: isNativePlatform ? true : options.includeAsyncPaths
    })
  }
}

module.exports = nativewindConfig
