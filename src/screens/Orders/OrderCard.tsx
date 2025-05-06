import React from 'react';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Order} from '../../types';
import utilStyles from '../../styles/utils';
import COLORS from '../../constants/colors';
import colorStyles from '../../styles/colors';
import globalStyles from '../../styles/global';
import {useNavigation} from '@react-navigation/native';

interface OrderCardProps {
  order: Order;
  index: number;
  action: object;
}

function OrderCard({order, index, action}: OrderCardProps): JSX.Element {
  const {t} = useTranslation();

  return (
    <Pressable style={[styles.card]} key={index} onPress={action}>
      <View style={[utilStyles.flexRow, styles.flex2]}>
        <View style={[styles.imageContainer, styles.center]}>
          <View style={[styles.image]}>
            <MaterialCommunityIcons
              name="table-chair"
              color={COLORS.primary}
              size={24}
            />
          </View>
          <View
            style={[
              order.status.includes('billed')
                ? colorStyles.bgYellow30
                : colorStyles.bgPrimary,
              utilStyles.px2,
              utilStyles.py1,
              utilStyles.br3,
              styles.statusPosition,
            ]}>
            <Text
              style={[
                globalStyles.tiny,
                utilStyles.capitalize,
                colorStyles.white,
              ]}>
              {order.status}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.flex8}>
        <Text
          style={[
            utilStyles.capitalize,
            globalStyles.boldText,
            utilStyles.w100,
            styles.refCode,
          ]}>
          {`#${order.ref_code}`}
        </Text>
        <Text style={[globalStyles.subP]}>
          {moment
            .utc(order.created_at)
            .utc()
            .local()
            .format('ddd, MMM DD, YYYY, h:mm:ss A')}
        </Text>
        <View style={styles.totalAndItem}>
          <Text style={[globalStyles.subP]}>
            {`${t(`item_${order.items.length > 1 ? 'plural' : 'one'}`, {
              count: order.items.length,
            })} | Total: ${t('toCurrency', {
              value: order.total,
            })}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    elevation: 4,
    padding: 8,
    backgroundColor: COLORS.white,
    marginBottom: 16,
    borderRadius: 8,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 64,
    height: 64,
  },
  image: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.grey50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalAndItem: {
    flexDirection: 'row',
    width: '90%',
  },
  flex8: {
    flex: 0.8,
  },
  flex2: {
    flex: 0.2,
  },
  center: {
    alignItems: 'center',
  },
  statusPosition: {
    position: 'absolute',
    bottom: 2,
  },
  refCode: {
    fontSize: 14,
  },
});

const equal = () => {
  return true;
};

export default React.memo(OrderCard, equal);
