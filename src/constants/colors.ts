import {REACT_APP_WHITE_LABEL} from '@env';
import whiteLabels from '../white-labels';

const COLORS = {
  primary: whiteLabels[REACT_APP_WHITE_LABEL].colors.primary,
  lightPrimary: whiteLabels[REACT_APP_WHITE_LABEL].colors.lightPrimary,
  white: '#ffffff',
  black: '#000000',
  grey: '#d6d6d6',
  lightGrey: '#f9f9f9',
  red: '#FC3D2F',
  green30: '#00A87E',
  yellow30: '#FFC50D',
  transparent: 'transparent',
  grey50: 'rgb(242,242,242)',
  background: 'rgb(250,250,250)',
};

export default COLORS;
