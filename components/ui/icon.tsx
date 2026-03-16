import { TextClassContext } from '@/components/ui/text'
import { cn } from '@/lib/utils/index'
import type { LucideIcon, LucideProps } from 'lucide-react-native'
import { styled } from 'nativewind'
import * as React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

type IconProps = LucideProps & {
  as: LucideIcon
}

// styled() processes className → style. We then pull style.color out and
// forward it as the `color` prop that Lucide icons actually consume.
function IconImpl({
  as: IconComponent,
  style,
  color,
  ...props
}: IconProps & { style?: StyleProp<ViewStyle> }) {
  const resolvedColor = (style as { color?: string } | undefined)?.color ?? color
  return <IconComponent {...props} color={resolvedColor} />
}

const StyledIconImpl = styled(IconImpl)

/**
 * A wrapper component for Lucide icons with Nativewind `className` support via `cssInterop`.
 *
 * This component allows you to render any Lucide icon while applying utility classes
 * using `nativewind`. It avoids the need to wrap or configure each icon individually.
 *
 * @component
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@/registry/components/ui/icon';
 *
 * <Icon as={ArrowRight} className="text-red-500" size={16} />
 * ```
 *
 * @param {LucideIcon} as - The Lucide icon component to render.
 * @param {string} className - Utility classes to style the icon using Nativewind.
 * @param {number} size - Icon size (defaults to 14).
 * @param {...LucideProps} ...props - Additional Lucide icon props passed to the "as" icon.
 */
function Icon({ as: IconComponent, className, size = 14, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext)
  return (
    <StyledIconImpl
      as={IconComponent}
      className={cn('text-foreground', textClass, className)}
      size={size}
      {...props}
    />
  )
}

export { Icon }
