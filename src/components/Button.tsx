import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import globalStyles from '../styles/global';
import COLORS from '../constants/colors';
import {ActivityIndicator} from 'react-native';

interface ButtonProps {
  label: string;
  action: any;
  loading: boolean;
  disabled: boolean;
}

function Button({
  label,
  action = null,
  loading = false,
  disabled = false,
}: ButtonProps): JSX.Element {
  return (
    <Pressable style={styles.container} onPress={action} disabled={disabled}>
      <Text style={styles.text}>{label}</Text>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={COLORS.white}
          style={styles.loading}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 50,
    width: '100%',
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  text: {
    ...globalStyles.title,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  loading: {position: 'absolute', right: 20},
});

export default Button;
