import {StyleSheet, Dimensions} from 'react-native';

import COLORS from '../constants/colors';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

const globalStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  p: {
    fontSize: 14,
    color: COLORS.black,
  },
  subP: {
    fontSize: 12,
    color: COLORS.black,
  },
  small: {
    fontSize: 12,
    color: COLORS.grey,
  },
  verSmall: {
    fontSize: 12,
    color: COLORS.grey,
  },
  tiny: {
    fontSize: 10,
    color: COLORS.grey,
  },
  border: {
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
  },
  shadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  btnShadow: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  boldText: {
    fontWeight: 'bold',
  },
  bottomAlign: {
    position: 'absolute',
    bottom: 0,
  },
  cardTopBorderRadius: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});

export default globalStyles;
