# React Native Expo Boilerplate

A production-oriented starting point for universal React Native applications. It combines Expo SDK 57, React Native 0.86, React Navigation, NativeWind, reusable accessible UI primitives, persisted sessions, localization, and automated quality checks.

The repository includes sample authentication, tab navigation, settings, and a development-only component gallery. Replace those screens with product code while keeping the app shell, providers, tooling, and shared UI layer.

## Included

- Expo SDK 57 with React Native's new architecture and Hermes.
- Android, iOS, and web entry points.
- React Navigation native stacks and bottom tabs.
- NativeWind 5 with semantic light and dark theme tokens.
- Reusable React Native Reusables-style UI components in `components/ui`.
- Zustand session state backed by SecureStore on native and local storage on web.
- i18next localization with English and Polish examples.
- ESLint, TypeScript, Prettier, Knip, and Bun's test runner.
- GitHub Actions quality checks and EAS development, preview, and production profiles.

## Requirements

- Bun 1.3.14, as specified by the `packageManager` field in `package.json`.
- Node.js 24, as specified by `.nvmrc`, for Expo and native-tooling compatibility.
- Xcode and CocoaPods for local iOS builds.
- Android Studio and an Android SDK for local Android builds.
- EAS CLI for cloud builds: `bun add --global eas-cli`.

Expo Go is useful for JavaScript-only work, but use a development build as soon as the app includes custom native modules.

## Quick start

```bash
nvm use
bun install --frozen-lockfile
bun start
```

Run a platform directly:

```bash
bun run ios
bun run android
bun run web
```

Create a reusable development build with EAS:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

## Rename the template

Before shipping an application, update these values in `app.json`:

1. `expo.name` and `expo.slug`.
2. `expo.ios.bundleIdentifier`.
3. `expo.android.package`.
4. Icons, splash assets, and theme colors.

Then regenerate the native projects so they match the Expo configuration:

```bash
bunx expo prebuild --clean
```

Review the generated iOS and Android diff before committing it. Treat `app.json` and Expo config plugins as the source of truth; avoid maintaining the same permission or entitlement manually in several files.

When enabling EAS for a new app, run `eas init`. That command adds the project owner and EAS project ID to the local Expo configuration.

## Project structure

```text
App.tsx                 Minimal application entry component
RootAppShell.tsx        Global CSS, providers, navigation, and portals
components/ui/          Shared design-system primitives
components/special/     Reusable composed components
contexts/               React context providers
i18n/                   Localization initialization and translations
lib/                    Framework-independent helpers and adapters
navigation/             Root, stack, and tab navigators
screens/                Sample route-level UI
store/                  Zustand stores and selectors
types/                  Shared TypeScript declarations
android/ and ios/       Generated native projects
```

Keep product logic out of `RootAppShell`. Long-running initialization should expose explicit idle, loading, ready, and error states and provide a visible retry path instead of leaving the app on an indefinite splash screen.

## Session persistence

`store/sessionStore.ts` stores one serialized session document under a single key:

- SecureStore on Android and iOS.
- `localStorage` on web.

The root navigator waits for one idempotent hydration operation. Replace the sample `User` shape and sign-in screens with your authentication client, but retain a single persistence owner to avoid hydration races.

SecureStore is suitable for small credentials and identity metadata. Store larger cached application data in SQLite or another purpose-built persistence layer.

## Commands

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `bun start`            | Start the Expo development server              |
| `bun run ios`          | Build and run the native iOS project           |
| `bun run android`      | Build and run the native Android project       |
| `bun run web`          | Start the web application                      |
| `bun run typecheck`    | Check TypeScript without emitting files        |
| `bun run lint`         | Run ESLint and reject warnings                 |
| `bun test`             | Run TypeScript unit tests with Bun             |
| `bun run format`       | Format supported repository files              |
| `bun run format:check` | Verify formatting without writing              |
| `bun run deadcode`     | Detect unused files, exports, and dependencies |
| `bun run validate`     | Run every local quality gate used by CI        |

## Testing

Place pure TypeScript tests next to their subject using `*.test.ts`. Bun's test runner executes TypeScript directly and is used for framework-independent domain logic:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'

test('example', () => {
  assert.equal(1 + 1, 2)
})
```

For full-device coverage, add Maestro flows and an environment-gated deterministic fixture harness for the application being built. Keep product fixtures out of this generic boilerplate and never enable a fixture harness in preview or production profiles.

## Native and dependency upgrades

Upgrade Expo as a coordinated unit:

```bash
bunx expo install expo@^57.0.9
bunx expo install --fix
bunx expo prebuild --clean
bun run validate
```

Also verify a production-style bundle after changes to Expo, NativeWind, Metro, Reanimated, or native modules:

```bash
bunx expo export --platform web
bunx expo export --platform android
bunx expo export --platform ios
```

The Metro configuration preserves async paths for native exports because the NativeWind/react-native-css serializer needs them. Keep that compatibility block covered by native release-export validation when upgrading.

Avoid scripts that silently rewrite `node_modules`. If an upstream patch is unavoidable, pin the affected package version, store a reviewable patch, fail when the expected source does not match, and remove it as soon as the upstream release is available.

### iOS toolchain compatibility

`expo-modules-jsi@57.1.0` does not compile unchanged with Xcode 26.0.1 and Apple Swift 6.2. The failures include Swift's [`weak let` incompatibility](https://github.com/expo/expo/issues/47819), invalid `SWIFT_RETURNS_RETAINED` constructor annotations tracked in [Expo issue #50067](https://github.com/expo/expo/issues/50067), and strict-concurrency diagnostics for callback pointers.

The exact package version is handled through Bun's `patchedDependencies` support. [`patches/expo-modules-jsi@57.1.0.patch`](patches/expo-modules-jsi@57.1.0.patch) contains source-only compatibility changes and is applied automatically by `bun install --frozen-lockfile`; do not edit the installed package directly. When Expo publishes a fixed version, upgrade the coordinated Expo dependency set, remove the patch entry and file, then verify `bunx expo-doctor`, `bun run validate`, and a clean `bun run ios` build.

## Adding local persistence

SQLite and Drizzle are deliberately not installed by default. For an offline-first application, add them as an application layer with:

- Platform-specific runtime adapters such as `client.ts` and `client.web.ts`.
- Versioned, transactional migrations.
- Repository functions between storage and UI state.
- An idempotent bootstrap operation with a visible failure/retry state.
- Deterministic seed functions used only by development or E2E builds.

This keeps the base template small while providing a clear path for applications that need structured local data.

## CI and releases

`.github/workflows/quality.yml` installs the pinned Bun version, runs `bun install --frozen-lockfile`, and executes `bun run validate` for pushes to `main` and pull requests.

`eas.json` defines:

- `development`: internal development-client builds.
- `preview`: internal release-like builds.
- `production`: store builds.

Add application-specific submit, update, credentials, and end-to-end workflows only after the app identifiers and EAS project have been configured.

## Troubleshooting

- After changing native dependencies or Expo plugins, run `bunx expo prebuild --clean` and reinstall pods through the generated workflow.
- If Metro behaves inconsistently after an upgrade, restart with `bunx expo start --clear`.
- If dependency versions drift from the SDK, run `bunx expo install --check` followed by `bunx expo install --fix`.
- If a native build fails, first reproduce from clean generated native projects before introducing an `AppDelegate`, Gradle, Podfile, or `node_modules` workaround.
