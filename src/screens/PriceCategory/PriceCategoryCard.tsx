import React from 'react';

import {StyleSheet, Text, Pressable} from 'react-native';

import {PriceCategory} from '../../types';
import COLORS from '../../constants/colors';
import globalStyles from '../../styles/global';

interface PriceCategoryCardProps {
  priceCategory: PriceCategory;
  index: number;
  cardStyle: any;
  selected: boolean;
  action: any;
}

function PriceCategoryCard({
  priceCategory,
  index,
  cardStyle,
  selected,
  action,
}: PriceCategoryCardProps): JSX.Element {
  return (
    <Pressable
      style={[cardStyle, selected ? styles.selected : null]}
      onPress={action}>
      <Text style={[globalStyles.p, selected ? styles.selectedText : null]}>
        {priceCategory.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor: COLORS.primary,
  },
  selectedText: {
    color: COLORS.white,
  },
});

const equal = (prev: any, next: any) => {
  if (prev.selected !== next.selected) {
    return false;
  }
  return false;
};

export default React.memo(PriceCategoryCard, equal);
