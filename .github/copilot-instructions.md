# Copilot Instructions

## Project Overview

This is a **React Native Expo** mobile game application built with TypeScript and NativeWind (Tailwind CSS for React Native). The project follows strict code quality standards focused on performance, stability, and accessibility.

## Project Structure

```
realm-of-dungeons-mobile/
├── App.tsx                    # Application entry point
├── screens/                   # Screen components (pages)
├── components/
│   ├── ui/                    # Reusable UI components (Button, Text, Card, etc.)
│   ├── primitives/            # Low-level primitive components (Dialog, Select, Tabs)
│   ├── arena/                 # Arena-related components
│   ├── battle/                # Battle system components
│   ├── character/             # Character-related components
│   ├── guild/                 # Guild system components
│   ├── merchants/             # Merchant/shop components
│   ├── realms/                # Realm exploration components
│   ├── village/               # Village components
│   └── ...                    # Other feature-specific component folders
├── store/
│   ├── index.ts               # Store exports with predefined selectors
│   ├── slices/                # Zustand store slices (characterCoreStore, etc.)
│   ├── queryKeys.ts           # Centralized React Query keys
│   └── types.ts               # Store type definitions
├── hooks/                     # Custom React hooks
├── api/
│   ├── services/              # API service functions
│   └── interceptors.ts        # Axios interceptors
├── data/                      # Static data and configurations
├── types/                     # TypeScript type definitions
├── utils/                     # Utility functions
├── lib/
│   └── utils/                 # Core utilities (cn, scaledSizes, scaling functions)
├── i18n/
│   └── translations/          # Translation JSON files (en.json, etc.)
├── navigation/                # React Navigation setup
├── assets/                    # Fonts, images, icons, sprites
└── scripts/                   # Build and generation scripts
```

## Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand with Immer middleware
- **Data Fetching**: TanStack Query (React Query)
- **Navigation**: React Navigation
- **Internationalization**: i18next / react-i18next
- **Package Manager**: **npm** - never use pnpm or yarn

## Core Development Principles

### 1. Code Quality & Stability

- Follow ESLint rules defined in `eslint.config.js`
- Write TypeScript for all code - prefer `interface` over `type`
- Focus on **stability and performance** over feature velocity
- Leave NO todos, placeholders, or incomplete implementations
- Ensure code is **free of memory leaks** - clean up subscriptions, timers, and listeners
- Test for edge cases and error states

### 2. Performance Optimization (CRITICAL)

- **Prevent unnecessary rerenders** - this is the highest priority
- Use `React.memo` for components that receive stable props
- Use `useMemo` for expensive computations and derived data
- Use `useCallback` for event handlers passed to child components
- Keep components **simple and atomic** - split complex components into smaller pieces
- Implement **code splitting** where appropriate
- Use stable, unique keys for list items (never array index for dynamic lists)

### 3. Zustand Store Best Practices (CRITICAL)

All Zustand stores MUST use predefined selectors for optimal performance:

```tsx
// ✅ CORRECT - Use predefined selectors from store
import { useCharacterCoreStore, selectCharacterLevel, selectCharacterGold } from '@/store'

const level = useCharacterCoreStore(selectCharacterLevel)
const gold = useCharacterCoreStore(selectCharacterGold)

// ❌ WRONG - Creates new selector on every render, causes rerenders
const level = useCharacterCoreStore((state) => state.data?.level)
```

When adding new store functionality, always:
1. Add the action/state to the store
2. Create and export a predefined selector
3. Use the selector in components

### 4. Component Architecture

- Use functional components with TypeScript interfaces
- Apply DRY principle - check existing components before creating new ones
- **Analyze existing screens** for similar UI patterns before implementing new UI
- **Feature-specific components**: `components/[feature]/_components/`
- **Shared UI components**: `components/ui/` (Button, Text, Card, Input, etc.)
- **Primitive components**: `components/primitives/` (Dialog, Select, Tabs)

### 5. Atomic Design & Reusability

- **Keep it simple**: Functions and components should be atomic - simple, focused, and reusable
- **Divide complex features**: Break down complex logic into smaller functions or separate files
- **No magic numbers**: Replace hardcoded values with named constants
- **No magic values**: Every value should be self-described for readability
- **Reusable constants**: Extract repeatable values into `constants/` folder

## File & Naming Conventions

- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Folders**: `kebab-case` or `camelCase` (follow existing patterns)
- **Enums**: `SCREAMING_SNAKE_CASE`
- **Interfaces**: `PascalCase` prefixed with `I` for store interfaces

## UI & Styling Guidelines

### Use Existing UI Components

Always use existing components from `components/ui/`:

```tsx
// ✅ CORRECT - Use existing components
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

// ❌ WRONG - Don't use raw React Native components for styled elements
import { Text } from 'react-native' // Don't do this for display text
```

### Scaled Sizes (CRITICAL)

**Never use raw Tailwind width/height for fixed dimensions.** Use `scaledSizes` from `lib/utils` for responsive scaling across devices:

```tsx
import { scaledSizes, scaleSize } from '@/lib/utils'

// ✅ CORRECT - Use predefined scaled sizes
<View style={scaledSizes.scaleSize12} /> // 48x48 scaled
<View style={scaledSizes.size8} />       // 32x32 scaled
<Image style={scaledSizes.scaleSize24} source={...} />

// For dynamic sizes, use scaleSize function
<View style={{ width: scaleSize(100), height: scaleSize(50) }} />

// ❌ WRONG - Raw Tailwind dimensions don't scale properly
<View className="h-12 w-12" /> // Avoid for fixed-size elements
```

Use Tailwind classes for:
- Padding, margin, spacing (`p-4`, `mx-2`, `space-y-3`)
- Flex layouts (`flex`, `flex-row`, `items-center`, `justify-between`)
- Colors and backgrounds (`bg-primary`, `text-white/70`)
- Borders and rounded corners (`border`, `rounded-lg`)

### Styling Approach

```tsx
import { cn } from '@/lib/utils'

// Use cn() for conditional class merging
<View className={cn(
  'flex flex-row items-center p-4',
  isActive && 'bg-primary/20',
  className
)} />
```

### Accessibility (CRITICAL)

All UI must be optimized for accessibility and VoiceOver:

```tsx
// ✅ CORRECT - Include accessibility props
<Button
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel={t('action.submit_form')}>
  <Text accessible={false}>{t('common.submit')}</Text>
</Button>

<View 
  accessible={true}
  accessibilityLabel="Character level 45, 1250 gold">
  <Text accessible={false}>Lv. 45</Text>
  <Text accessible={false}>1,250 gold</Text>
</View>

// Group related elements with accessible={true} on parent
// Set accessible={false} on child Text elements to prevent double-reading
```

## Internationalization (i18n)

### Using Translations

```tsx
import { useTranslation } from 'react-i18next'

const { t } = useTranslation()

// Use existing translation keys
<Text>{t('common.loading')}</Text>
<Text>{t('guild.no_guild')}</Text>

// With interpolation
<Text>{t('character.level_up_congrats', { level: 45 })}</Text>
```

### Adding New Translations

1. **First, check if a matching translation key already exists** in `i18n/translations/en.json`
2. If no matching key exists, add ONLY to `en.json` - other languages will be added manually
3. Use descriptive, hierarchical key names: `section.subsection.key_name`

```json
// i18n/translations/en.json
{
  "guild_raids": {
    "cooldown_remaining": "Next raid available in {{time}}",
    "start_raid": "Start Raid"
  }
}
```

## State Management

### Zustand Store Pattern

```tsx
// store/slices/exampleStore.ts
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface IExampleStore {
  data: DataType | null
  isLoading: boolean
  setData: (data: DataType) => void
}

export const useExampleStore = create<IExampleStore>()(
  devtools(
    subscribeWithSelector(
      immer((set) => ({
        data: null,
        isLoading: false,
        setData: (data) => set((state) => {
          state.data = data
        })
      }))
    ),
    { name: 'example-store' }
  )
)

// ALWAYS export predefined selectors
export const selectExampleData = (state: IExampleStore) => state.data
export const selectExampleLoading = (state: IExampleStore) => state.isLoading
```

### React Query Integration

```tsx
import { queryKeys } from '@/store/queryKeys'
import { useQuery, useMutation } from '@tanstack/react-query'

// Use centralized query keys
const { data } = useQuery({
  queryKey: queryKeys.character.core,
  queryFn: () => fetchCharacterData()
})
```

## API Integration

```tsx
// api/services/exampleRoutes.ts
import { api } from '@/api'

export const fetchExampleData = async (id: string) => {
  const response = await api.get(`/example/${id}`)
  return response.data
}

export const updateExampleData = async (data: UpdateData) => {
  const response = await api.post('/example/update', data)
  return response.data
}
```

## Development Workflow

### Before Writing Code

1. **Analyze**: Review existing patterns, components, and similar screens
2. **Check existing UI**: Look for similar elements that can be reused
3. **Check translations**: Verify if translation keys already exist
4. **Plan**: Consider performance implications and potential rerenders
5. **Implement**: Write complete, functional, optimized code

### Code Quality Checklist

- ✅ Follows ESLint rules from `eslint.config.js`
- ✅ TypeScript interfaces defined
- ✅ Uses existing UI components (Text, Button, Card, etc.)
- ✅ Uses `scaledSizes` for fixed dimensions
- ✅ Uses predefined Zustand selectors
- ✅ Accessibility attributes added (accessibilityRole, accessibilityLabel)
- ✅ Uses `memo`, `useMemo`, `useCallback` appropriately
- ✅ No memory leaks (cleanup in useEffect)
- ✅ No unnecessary rerenders
- ✅ Uses existing translation keys or adds to en.json only
- ✅ No todos or placeholders left

## Common Patterns

### Memoized Components

```tsx
import { memo, useMemo, useCallback } from 'react'

const ListItem = memo(({ item, onPress }: ListItemProps) => {
  const handlePress = useCallback(() => {
    onPress(item.id)
  }, [item.id, onPress])

  return (
    <Pressable onPress={handlePress}>
      <Text>{item.name}</Text>
    </Pressable>
  )
})
ListItem.displayName = 'ListItem'
```

### Conditional Rendering

```tsx
// Prefer logical operators for conditional rendering
{isLoading ? <ShimmerSkeleton /> : null}
{error ? <ErrorMessage error={error} /> : null}
{data?.length > 0 ? <DataList data={data} /> : <EmptyState />}
```

### Effect Cleanup

```tsx
useEffect(() => {
  const subscription = someObservable.subscribe(handler)
  const timer = setInterval(updateTime, 1000)
  
  // Always clean up
  return () => {
    subscription.unsubscribe()
    clearInterval(timer)
  }
}, [dependencies])
```

### Dialog Pattern

```tsx
import { Dialog, DialogContent, DialogTrigger, DialogCloseX } from '@/components/primitives/Dialog'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button><Text>Open</Text></Button>
  </DialogTrigger>
  <DialogContent>
    <View className="flex w-full flex-row justify-between bg-black/20 p-2">
      <Text>{t('dialog.title')}</Text>
      <DialogCloseX onPress={() => setIsOpen(false)} />
    </View>
    {/* Content */}
  </DialogContent>
</Dialog>
```

---

**Remember**: 
- Always prioritize **performance** and **stability**
- Check for **existing patterns** before implementing new solutions
- Use **predefined selectors** for Zustand stores
- Use **scaledSizes** for fixed dimensions
- Ensure **accessibility** for all interactive elements
- Add translations to **en.json only**