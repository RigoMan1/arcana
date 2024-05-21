// Utilities
import { computed, unref } from 'vue'
import { getCurrentInstanceName, propsFactory } from '../util'

// Types
import type { PropType } from 'vue'
import type { MaybeRef } from '../util'

export const allowedColors = [
  'listcleanser',

  'primary',
  'secondary',

  'error',
  'warn',
  'info',
  'success',

  'light',
  'dark',

  'white',
  'black',
  null
] as const

export type Color = typeof allowedColors[number]

export interface ColorProps {
  color: Color
}

export const makeColorProps = propsFactory({
  color: {
    type: String as PropType<Color>,
    default: 'primary',
    validator: (v: any) => allowedColors.includes(v),
  },
}, 'color')

export function useColor(
  props: MaybeRef<ColorProps>,
  name = getCurrentInstanceName(),
) {
  const colorClasses = computed(() => {
    const { color } = unref(props)
    if (!color) return []
    return `${name}--color-${color}`
  })

  return { colorClasses }
}