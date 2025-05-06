import _, {capitalize} from 'lodash';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

import {Order, Variation} from '../../types';
import utilStyles from '../../styles/utils';
import COLORS from '../../constants/colors';
import globalStyles from '../../styles/global';
import Button from '../../components/Button';
import {
  setCustomAttributes,
  setCustomer,
  setOrder,
  setPriceCategory,
  setTables,
} from '../../redux/slices/cartSlice';
import {
  useEditOrderMutation,
  useOrderStatusUpdateMutation,
} from '../../services/api';

function OrderDetail({navigation, route}): JSX.Element {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [order] = useState<Order>(route.params.order);
  const insets = useSafeAreaInsets();
  const [editOrderApi] = useEditOrderMutation();
  const [orderStatusUpdateApi] = useOrderStatusUpdateMutation();
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const printerSettings = useSelector(
    (state: any) => state.waiter.settings.printer,
  );

  const orderStatusUpdateAction = useCallback(async () => {
    setStatusLoading(true);
    const response = await orderStatusUpdateApi({
      ...order,
      ...printerSettings,
      status: 'billed',
    });

    if (response.data) {
      navigation.goBack();
    }
    setStatusLoading(false);
  }, [navigation, order, orderStatusUpdateApi, printerSettings]);

  const headerRight = useCallback(
    () =>
      statusLoading ? (
        <ActivityIndicator size={'small'} color={COLORS.primary} />
      ) : (
        <Pressable onPress={orderStatusUpdateAction} disabled={statusLoading}>
          <MaterialCommunityIcons
            name="printer-outline"
            size={24}
            color={COLORS.primary}
          />
        </Pressable>
      ),
    [orderStatusUpdateAction, statusLoading],
  );

  React.useEffect(() => {
    if (order.status !== 'billed') {
      navigation.setOptions({
        headerRight: headerRight,
      });
    }
  }, [headerRight, navigation]);

  const renderRowItem = (title: string, value: string) => (
    <View
      style={[
        utilStyles.flexRow,
        utilStyles.justifyContentBetween,
        utilStyles.mb1,
      ]}>
      <Text style={[globalStyles.p, utilStyles.capitalize]}>{title}</Text>
      <Text style={[globalStyles.p]}>{value}</Text>
    </View>
  );

  const renderOrderItem = (item: Variation, index: number) => (
    <View
      style={[index < order.items.length - 1 ? styles.border : null]}
      key={index}>
      <View style={[utilStyles.flexRow, utilStyles.mb2, utilStyles.mt2]}>
        <View style={styles.flex2}>
          <Text style={[globalStyles.p]}>{item.name}</Text>
          {item?.groups?.length > 0 ? (
            <Text style={[globalStyles.subP]}>
              {item?.groups
                ?.filter(g => g.type === 'combo')
                .map(g => `${g.item_variation_name}`)
                .join(', ')}
            </Text>
          ) : null}
        </View>
        <View style={styles.itemMrp}>
          <Text style={[globalStyles.p]}>
            {t('toCurrency', {
              value: item.price,
            })}
          </Text>
        </View>
        <View style={styles.itemQty}>
          <Text style={[globalStyles.p]}>x {item.ordered_quantity}</Text>
        </View>
        <View style={styles.subtotal}>
          <Text style={[globalStyles.p]}>
            {t('toCurrency', {
              value: item.sub_total,
            })}
          </Text>
        </View>
      </View>
      {item.notes ? (
        <View style={[utilStyles.flexRow]}>
          <Text style={{fontSize: 12}}>{capitalize(t('notes'))} : </Text>
          <Text style={styles.itemNotes}>{capitalize(item.notes)}</Text>
        </View>
      ) : null}
    </View>
  );

  const renderRow = (title: string, value: string | number) => (
    <View
      style={[
        utilStyles.flexGrow,
        utilStyles.flexRow,
        utilStyles.justifyContentBetween,
      ]}>
      <Text style={[globalStyles.p, utilStyles.capitalize]}>{title}</Text>
      <Text style={[globalStyles.p]}>{value}</Text>
    </View>
  );

  const editOrderAction = async () => {
    const response = await editOrderApi(order);
    if (response.data) {
      dispatch(setPriceCategory(order.price_category));
      dispatch(setTables(order.tables));
      dispatch(setCustomer(order.customer));
      dispatch(setOrder(order));
      dispatch(setCustomAttributes(order.custom_attributes));
      navigation.navigate('Items');
    }
  };

  return (
    <SafeAreaView style={[utilStyles.h100, utilStyles.w100]}>
      <ScrollView style={[utilStyles.flex]}>
        <View style={[utilStyles.px4, utilStyles.py2]}>
          <View style={styles.card}>
            <Text
              style={[
                globalStyles.subtitle,
                utilStyles.capitalize,
                utilStyles.mb1,
                globalStyles.boldText,
              ]}>
              {t('orderDetails')}
            </Text>
            <Text style={[globalStyles.p, utilStyles.capitalize]}>
              {t('orderId', {id: order.id})}
            </Text>
            {renderRowItem(
              t('dateTime'),
              moment
                .utc(order.created_at)
                .utc()
                .local()
                .format('ddd, MMM DD, YYYY, h:mm:ss A'),
            )}
            {renderRowItem(t('employee'), order.created_by.name)}
          </View>

          <View style={styles.card}>
            <Text
              style={[
                globalStyles.subtitle,
                utilStyles.capitalize,
                utilStyles.mb1,
                globalStyles.boldText,
              ]}>
              {t('orderItems')}
            </Text>
            {order.items.map((item, index) => renderOrderItem(item, index))}
          </View>

          <View style={styles.card}>
            <Text
              style={[
                globalStyles.subtitle,
                utilStyles.capitalize,
                utilStyles.mb1,
                globalStyles.boldText,
              ]}>
              {t('kotHistory')}
            </Text>
            {Object.values(_.groupBy(order.KOTHistory, 'kot_id')).map(
              (kots, index, kotHistory) => {
                return (
                  <View
                    style={[
                      index < kotHistory.length - 1 ? styles.border : null,
                      {flexDirection: 'row', marginVertical: 4},
                    ]}>
                    <Text style={[styles.kotSnoValue]}>{index + 1}</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      {kots.map(kot => (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{flex: 3}}>
                            <Text
                              style={[styles.kotValue, {textAlign: 'left'}]}>
                              {kot.item_variation_name}
                            </Text>
                            {kot?.groups?.length > 0 ? (
                              <Text style={globalStyles.small.fontSize}>
                                {kot?.groups
                                  ?.filter(g => g.type === 'modifier')
                                  .map(g => g.item_variation_name)
                                  .join(', ')}
                              </Text>
                            ) : null}
                          </View>
                          <View style={styles.kotQty}>
                            <Text style={[globalStyles.p]}>
                              x {kot.quantity}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.kotStatus,
                              {alignItems: 'flex-end'},
                            ]}>
                            <Text style={{textTransform: 'capitalize'}}>
                              {t(kot.status.replace(/_/g, ' '))}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              },
            )}
          </View>

          <View
            style={[
              styles.card,
              utilStyles.flexRow,
              utilStyles.alignItemsCenter,
            ]}>
            <MaterialCommunityIcons
              name="table-chair"
              size={24}
              color={COLORS.primary}
            />
            <View style={[utilStyles.ml4]}>
              <Text
                style={[
                  globalStyles.p,
                  globalStyles.boldText,
                  utilStyles.capitalize,
                ]}>
                {t('table.0')}
              </Text>
              <Text style={[globalStyles.p]}>
                {order.tables.map(table => table.name).join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text
              style={[
                globalStyles.subtitle,
                globalStyles.boldText,
                utilStyles.capitalize,
                utilStyles.mb1,
              ]}>
              {t('billDetails')}
            </Text>
            {renderRow(t('totalItem'), order.items.length)}
            {renderRow(
              t('totalQuantity'),
              order.items.reduce((sum, item) => {
                sum += item.quantity;
                return sum;
              }, 0),
            )}
            {renderRow(
              t('subtotal'),
              t('toCurrency', {
                value: order.sub_total,
              }),
            )}
            {renderRow(
              t('tax.0'),
              t('toCurrency', {
                value: order.tax,
              }),
            )}
            {renderRow(
              t('roundOff'),
              t('toCurrency', {
                value: order.round_off,
              }),
            )}
            {renderRow(
              t('charge'),
              t('toCurrency', {
                value: order.charge,
              }),
            )}

            <View
              style={[
                utilStyles.flexGrow,
                utilStyles.flexRow,
                utilStyles.justifyContentBetween,
                utilStyles.mt1,
              ]}>
              <Text
                style={[
                  globalStyles.title,
                  utilStyles.capitalize,
                  globalStyles.boldText,
                ]}>
                {t('total')}
              </Text>
              <Text style={[globalStyles.title, globalStyles.boldText]}>
                {t('toCurrency', {
                  value: order.total,
                })}
              </Text>
            </View>
          </View>
          {order.status !== 'billed' ? (
            <Button
              label={t('addItem')}
              action={editOrderAction}
              loading={false}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  card: {
    elevation: 4,
    padding: 8,
    backgroundColor: COLORS.white,
    marginBottom: 16,
    borderRadius: 8,
  },
  subtotal: {flex: 1, alignItems: 'flex-end'},
  itemQty: {flex: 0.8, alignItems: 'center'},
  itemMrp: {flex: 1, alignItems: 'center'},
  flex2: {flex: 2},
  border: {
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.grey,
  },
  kotRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  kotSno: {
    ...globalStyles.p,
    width: 50,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  kotTitle: {
    ...globalStyles.p,
    flex: 1,
    fontWeight: '500',
    textAlign: 'center',
  },
  kotStatus: {
    ...globalStyles.p,
    flex: 1,
    textTransform: 'capitalize',
    fontWeight: '500',
    textAlign: 'flex-end',
  },
  kotName: {
    ...globalStyles.p,
    flex: 3,
    fontWeight: '500',
  },
  kotQty: {flex: 1, alignItems: 'center'},
  kotSnoValue: {
    ...globalStyles.p,
    width: 50,
    textTransform: 'capitalize',
  },
  kotValue: {
    ...globalStyles.p,
    flex: 1,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  itemNotes: {
    width: '80%',
    fontSize: 12,
  },
});

export default OrderDetail;
