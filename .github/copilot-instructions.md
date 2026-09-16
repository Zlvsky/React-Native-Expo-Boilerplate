# Repository instructions

## Project

This is a universal React Native application boilerplate built with Expo SDK 57, TypeScript, React Navigation, NativeWind, and Zustand. It targets Android, iOS, and web and uses Bun.

## Validation

Before finishing a change, run the checks relevant to it. Run the complete gate for cross-cutting changes:

```bash
bun run validate
```

Do not introduce lint warnings, TypeScript errors, focused tests, or platform-specific changes without checking the affected platform configuration.

## Architecture

- Keep `App.tsx` minimal.
- Put global providers and navigation wiring in `RootAppShell.tsx`.
- Keep route-level UI in `screens/`.
- Put reusable product components in `components/<feature>/`.
- Put design-system primitives in `components/ui/`.
- Keep framework-independent logic in `lib/` and cover it with `*.test.ts` files.
- Keep Zustand stores focused on state orchestration. Move persistence and platform APIs behind adapters.
- Export stable selectors for frequently consumed store state.
- Model asynchronous initialization with explicit idle, loading, ready, and error states. Always provide a visible recovery path.

## Expo and native projects

Treat `app.json` and Expo config plugins as the source of truth for generated native configuration. After changing Expo SDK versions, native dependencies, permissions, entitlements, or plugins, regenerate with:

```bash
bunx expo prebuild --clean
```

Review generated native diffs. Do not add custom `AppDelegate`, Gradle, Podfile, Metro, or `node_modules` workarounds unless a clean generated build reproduces the problem and the workaround is documented and version-bounded.

Use `bunx expo install` for Expo and React Native packages so versions remain compatible with the active SDK.

## TypeScript and React

- Keep strict TypeScript enabled and avoid `any` when a useful type can be expressed.
- Prefer small components and plain functions over premature abstraction.
- Use memoization only when identity stability or measured rendering cost requires it.
- Clean up subscriptions, listeners, timers, and background work in effects.
- Do not suppress hook dependency warnings without explaining the invariant.

## Styling and accessibility

- Use semantic tokens from `global.css` instead of duplicating color literals.
- Use `cn` for conditional class composition.
- Reuse `components/ui` before creating another primitive.
- Give interactive controls meaningful roles, labels, states, and sufficiently large touch targets.
- Respect the system color scheme and reduced-motion preferences unless a product explicitly documents another behavior.

## Localization

User-facing copy should use i18next keys. Keep all shipped locale files structurally aligned and use interpolation instead of string concatenation.

## Persistence and security

- Keep one owner for each persisted value.
- Store only small credentials and identity metadata in SecureStore.
- Use SQLite or another appropriate data layer for larger structured data.
- Never commit credentials, signing keys, tokens, `.env` files, or EAS secrets.

## Package management

Use the Bun version pinned in `package.json` and commit `bun.lock`. Install dependencies with `bun install` and run package binaries with `bunx`. Runtime imports belong in `dependencies`; build, test, lint, and formatting tools belong in `devDependencies`.
