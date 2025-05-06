import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import COLORS from '../constants/colors';
import globalStyles from '../styles/global';
import colorStyles from '../styles/colors';
import utilStyles from '../styles/utils';

interface ChipProps {
  label: string;
  action: any;
  selected: boolean;
  icon: any;
  index: number;
}

function Chip({
  label,
  action = null,
  selected = false,
  icon = null,
  index,
}: ChipProps): JSX.Element {
  return (
    <Pressable
      style={[
        styles.container,
        selected ? styles.select : null,
        index === 0 && icon != null ? styles.selectedContiner : null,
        { paddingHorizontal: 15 }
      ]}
      onPress={action}>
      {icon ? icon() : null}
      <Text
        style={[
          globalStyles.p,
          utilStyles.capitalize,
          selected ? colorStyles.white : null,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    marginEnd: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
    height: 40,
    borderRadius: 50,
    elevation: 4,
    flexDirection: 'row',
  },
  select: {
    backgroundColor: COLORS.primary,
  },
  text: {
    ...globalStyles.title,
    color: COLORS.white,
  },
  selectedContiner: {
    paddingEnd: 8,
  },
  selectedText: {
    color: COLORS.primary,
  },
});

const equal = (prev: any, next: any) => {
  if (prev.label !== next.label || prev.selected !== next.selected) {
    return false;
  }
  return true;
};

export default React.memo(Chip, equal);
