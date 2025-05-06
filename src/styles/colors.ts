import {StyleSheet} from 'react-native';
import COLORS from '../constants/colors';

const styles = {};

Object.keys(COLORS).forEach(color => {
  styles[color] = {color: COLORS[color]};
  styles[`bg${color.charAt(0).toUpperCase() + color.slice(1)}`] = {
    backgroundColor: COLORS[color],
  };
  styles[`border${color.charAt(0).toUpperCase() + color.slice(1)}`] = {
    borderColor: COLORS[color],
  };
});

const colorStyles = StyleSheet.create(styles);

export default colorStyles;
