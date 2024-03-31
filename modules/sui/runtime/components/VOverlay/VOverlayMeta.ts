import { propsFactory } from '../../util';

import { makeLocationStrategyProps } from './locationStrategies';
import { makeScrollStrategyProps } from './scrollStrategies';
import { makeTransitionProps } from '../../composables/transition';
import { makeLazyProps } from '../../composables/lazy';
import { makeActivatorProps } from './useActivator';

import { makeDimensionProps } from '../../composables/dimensions';

import type { PropType } from 'vue';

export const makeVOverlayProps = propsFactory(
  {
    _disableGlobalStack: Boolean,
    tag: {
      type: String,
      default: 'div',
    },
    arrow: Boolean,
    absolute: Boolean,
    attach: [Boolean, String, Object] as PropType<boolean | string | Element>,
    closeOnBack: {
      type: Boolean,
      default: true,
    },
    contained: Boolean,
    contentClass: null,
    contentProps: null,
    disabled: Boolean,
    opacity: [Number, String],
    noClickAnimation: Boolean,
    modelValue: Boolean,
    persistent: Boolean,
    scrim: {
      type: [Boolean, String],
      default: true,
    },
    zIndex: {
      type: [Number, String],
      default: 2000,
    },

    ...makeActivatorProps(),
    ...makeDimensionProps(),
    ...makeLazyProps(),
    ...makeLocationStrategyProps(),
    ...makeScrollStrategyProps(),
    ...makeTransitionProps(),
  },
  'VOverlay'
);
