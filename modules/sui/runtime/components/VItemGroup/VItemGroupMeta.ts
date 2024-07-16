// Composables
import { makeComponentProps } from '../../composables/component';
import { makeGroupProps } from '../../composables/group';

import { propsFactory } from '../../util';

export const VItemGroupSymbol = Symbol.for('vuetify:v-item-group');

export const makeVItemGroupProps = propsFactory(
  {
    ...makeComponentProps(),
    ...makeGroupProps({
      selectedClass: 'v-item--selected',
    }),
  },
  'VItemGroup'
);
