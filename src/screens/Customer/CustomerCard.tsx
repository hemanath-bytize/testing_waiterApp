import {useTranslation} from 'react-i18next';
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {Customer} from '../../types';
import COLORS from '../../constants/colors';
import globalStyles from '../../styles/global';
import utilStyles from '../../styles/utils';
import {useSelector} from 'react-redux';

interface CustomerCardProps {
  customer: Customer;
  index: number;
  selected: object;
}

function CustomerCard({
  customer,
  index,
  selected,
}: CustomerCardProps): JSX.Element {
  const {t} = useTranslation();
  const merchant = useSelector(state => state.server?.merchant);

  return (
    <Pressable style={styles.card} key={index} onPress={selected}>
      <Text
        style={[globalStyles.p, globalStyles.boldText, utilStyles.capitalize]}>
        {customer.first_name} {customer.last_name}
      </Text>
      <Text style={[globalStyles.p]}>
        {customer.calling_code ? `+${customer.calling_code}` : ''}{' '}
        {merchant.merchant.settings.general.mask_customer_info
          ? 'xxxxxx' + customer.phone.substr(-4)
          : customer.phone}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    padding: 8,
    backgroundColor: COLORS.white,
    marginBottom: 8,
    borderRadius: 8,
    minHeight: 60,
  },
});

const equal = () => {
  return true;
};

export default React.memo(CustomerCard, equal);
