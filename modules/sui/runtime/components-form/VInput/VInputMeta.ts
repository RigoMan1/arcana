// Components
import { VSlideYTransition } from '../../components-transitions';

// Composables
import { makeComponentProps } from '../../composables/component';
import { makeTransitionProps } from '../../composables/transition';
import { makeFocusProps } from '../../composables/focus';

// Utilities
import { EventProp, propsFactory } from '../../util';

// Types
import type { PropType } from 'vue';

export const makeVInputProps = propsFactory(
  {
    id: String,

    label: String,
    hint: String,
    prependIcon: String,
    appendIcon: String,
    messages: {
      type: [Array, String] as PropType<string | readonly string[]>,
      default: () => [],
    },
    errorMessages: {
      type: [Array, String] as PropType<string | readonly string[] | null>,
      default: () => [],
    },

    disabled: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    readonly: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    dirty: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },
    error: {
      type: Boolean as PropType<boolean | null>,
      default: null,
    },

    maxErrors: {
      type: [Number, String],
      default: 3,
    },
    centerAffix: {
      type: Boolean,
      default: true,
    },
    direction: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
      validator: (v: any) => ['horizontal', 'vertical'].includes(v),
    },
    hideDetails: [Boolean, String] as PropType<boolean | 'auto'>,
    persistentHint: Boolean,

    'onClick:prepend': EventProp<[MouseEvent]>(),
    'onClick:append': EventProp<[MouseEvent]>(),

    ...makeFocusProps(),
    ...makeComponentProps(),
  },
  'VInput'
);

// Types
import type { Component } from 'vue';

export const makeVMessagesProps = propsFactory(
  {
    active: Boolean,
    messages: {
      type: [Array, String] as PropType<string | readonly string[]>,
      default: () => [],
    },

    ...makeComponentProps(),
    ...makeTransitionProps({
      transition: {
        component: VSlideYTransition as Component,
        leaveAbsolute: true,
        group: true,
      },
    }),
  },
  'VMessages'
);
