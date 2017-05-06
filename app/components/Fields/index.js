import Dropdown from './Dropdown';
import Text from '../Input';
import Numeric from './Numeric';
import Color from './Color';
import RichText from './RichText';
import Asset from './Asset';
import Toggle from './Toggle';
import List from '../List';
import Checkboxes from '../Checkbox/Checkboxes';

export default {
  Dropdown: {
    component: Dropdown,
    fields: [{ component: List, name: 'options' }],
  },
  Text: {
    component: Text,
    props: {
      full: true,
    },
    fields: [
      {
        component: Text,
        label: 'Placeholder Text',
        instructions: 'Text that will show in the field until a value has been written.',
        name: 'placeholder',
      },
      {
        component: Numeric,
        label: 'Max Length',
        instructions: 'The maximum number of characters allowed for this field.',
        name: 'maxLength',
      },
    ],
  },
  Number: {
    component: Numeric,
    fields: [
      {
        component: Numeric,
        label: 'Maximum Value',
        name: 'max',
      },
      {
        component: Numeric,
        label: 'Minimum Value',
        name: 'min',
      },
      {
        component: Numeric,
        label: 'Step',
        instructions: 'By how much will each change increment.',
        name: 'step',
      },
    ],
  },
  Color: {
    component: Color,
  },
  'Rich Text': {
    component: RichText,
  },
  Asset: {
    component: Asset,
    fields: [
      {
        component: Checkboxes,
        label: 'Allowed Extensions',
        instructions: 'A list of allowed file extensions',
        name: 'extension',
        checkboxes: [{ name: 'png', label: 'PNG', value: true }, { name: 'jpg', label: 'JPG', value: true }],
      },
    ],
  },
  Toggle: {
    component: Toggle,
    fields: [
      {
        component: Toggle,
        label: 'Default Value',
        name: 'defaultValue',
      },
    ],
  },
  Checkboxes: {
    component: Checkboxes,
    fields: [{ component: List, name: 'options' }],
  },
};
