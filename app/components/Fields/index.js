import Dropdown from './Dropdown';
import Text from './Text';
import Color from './Color';
import RichText from './RichText';
import Asset from './Asset';
import List from '../List';

export default {
  Dropdown: {
    component: Dropdown,
    fields: [
      { type: List, name: 'options' },
    ],
  },
  Text: {
    component: Text,
  },
  Color: {
    component: Color,
  },
  RichText: {
    component: RichText,
  },
  Asset: {
    component: Asset,
  },
};
