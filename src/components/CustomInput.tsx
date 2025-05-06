import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import colorStyles from '../styles/colors';
import utilStyles from '../styles/utils';
import globalStyles from '../styles/global';
import COLORS from '../constants/colors';

export const CustomInput = ({
  containerStyle,
  label,
  labelStyle,
  required = false,
  error,
  value,
  leadingAccessory,
  trailingAccessory,
  black = false,
  helperText = null,
  ...inputProps
}) => (
  <View style={containerStyle}>
    {label ? (
      <Text
        style={[
          globalStyles.small,
          black ? colorStyles.black : colorStyles.white,
          labelStyle,
        ]}>
        {label}
        {required && <Text style={colorStyles.red}> *</Text>}
      </Text>
    ) : null}

    <TextInput
      value={value}
      style={[
        globalStyles.title,
        styles.input,
        styles.inputOutline,
        black ? styles.black : null,
        error ? {borderColor: COLORS.red} : null,
      ]}
      {...inputProps}
    />
    {error ? (
      <Text
        style={[
          globalStyles.small,
          black ? colorStyles.red : colorStyles.primary,
          utilStyles.mt1,
        ]}>
        {error.charAt(0).toUpperCase() + error.slice(1)}
      </Text>
    ) : helperText ? (
      <Text style={[globalStyles.small, colorStyles.black, utilStyles.mt1]}>
        {helperText}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  inputOutline: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.primary,
    // color: COLORS.white,
    height: 40,
  },
  input: {
    padding: 0,
    width: '100%',
  },
  black: {
    borderColor: COLORS.black,
    color: COLORS.black,
  },
  trailingAccessory: {
    paddingRight: 8,
    position: 'absolute',
    right: 1,
    bottom: 12,
  },
  leadingAccessory: {
    paddingRight: 8,
    // position: 'absolute',
    // left: 1,
    // bottom: 12,
  },
});
