import { propsFactory } from '../util';

import { makeLocationStrategyProps } from './composables/locationStrategies';
import { makeScrollStrategyProps } from './composables/scrollStrategies';
import { makeTransitionProps } from '../composables/transition';
import { makeLazyProps } from '../composables/lazy';
import { makeActivatorProps } from './composables/useActivator';
import { makeComponentProps } from '../composables/component';
import { makeDimensionProps } from '../composables/dimensions';

import type { PropType } from 'vue';

export const makeVOverlayProps = propsFactory(
  {
    _disableGlobalStack: Boolean,
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
    ...makeComponentProps(),
    ...makeDimensionProps(),
    ...makeLazyProps(),
    ...makeLocationStrategyProps(),
    ...makeScrollStrategyProps(),
    ...makeTransitionProps(),
  },
  'VOverlay'
);
