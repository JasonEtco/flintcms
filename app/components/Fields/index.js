import Dropdown from './Dropdown';
import Text from '../Input';
import Numeric from './Numeric';
import Color from './Color';
import RichText from './RichText';
import Asset from './Asset';
import Toggle from './Toggle';
import List from '../List';
import Checkbox from '../Checkbox';
import Checkboxes from '../Checkbox/Checkboxes';

export default {
  Dropdown: {
    component: Dropdown,
    fields: [
      { type: List, name: 'options' },
    ],
  },
  Text: {
    component: Text,
    props: {
      full: true,
    },
    fields: [
      {
        type: Text,
        label: 'Instructions',
        instructions: 'Text that appears above the field, to give some instructions to the user.',
        name: 'instructions',
      },
      {
        type: Text,
        label: 'Placeholder Text',
        instructions: 'Text that will show in the field until a value has been written.',
        name: 'placeholder',
      },
      {
        type: Numeric,
        label: 'Max Length',
        instructions: 'The maximum number of characters allowed for this field.',
        name: 'maxLength',
      },
    ],
  },
  Color: {
    component: Color,
  },
  RichText: {
    component: RichText,
  },
  Asset: {
    component: Asset,
    fields: [
      {
        type: Checkboxes,
        label: 'Allowed Extensions',
        instructions: 'A list of allowed file extensions',
        name: 'extension',
        checkboxes: [{ name: 'png', label: 'png', value: true }, { name: 'jpg', label: 'jpg', value: true }],
      },
    ],
  },
  Checkbox: {
    component: Checkbox,
  },
  Toggle: {
    component: Toggle,
  },
  Checkboxes: {
    component: Checkboxes,
    fields: [
      { type: List, name: 'checkboxes' },
    ],
  },
};
