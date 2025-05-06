import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  ScrollView,
  Platform,
  TextInput,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Cart} from '../../types/Cart';
import {Employee, Variation} from '../../types';
import CartItemCard from './CartItemCard';
import utilStyles from '../../styles/utils';
import {RootState} from '../../redux/store';
import COLORS from '../../constants/colors';
import globalStyles from '../../styles/global';
import Button from '../../components/Button';
import {usePlaceOrderMutation} from '../../services/api';
import {
  resetCart,
  setCustomAttributes,
  setCustomer,
} from '../../redux/slices/cartSlice';
import _, {capitalize} from 'lodash';
import {resetVariations} from '../../redux/slices/waiterSlice';

function CartScreen({navigation}): JSX.Element {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [placeOrderApi] = usePlaceOrderMutation();
  const employee: Employee = useSelector(state => state.waiter?.employee);
  const cart: Cart = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState<boolean>(false);
  const [placeOrderDisabled, setPlaceOrderDisabled] = useState(false);
  useEffect(() => {
    dispatch(resetVariations({}));
  }, []);
  useEffect(() => {
    if (!cart.items.length) {
      dispatch(resetCart({}));
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Tables',
          },
        ],
      });
    }
  }, [cart.items, dispatch, navigation]);

  const renderItems = useCallback(
    ({item, index}: {item: Variation; index: number}) => {
      return <CartItemCard variation={item} index={index} />;
    },
    [],
  );

  const addCustomerAction = () => {
    navigation.navigate('Customer');
  };

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
  const placeOrderAction = () => {
    setPlaceOrderDisabled(true);
    setLoading(true);
    placeOrderApi({
      waiter: {id: employee.id, name: employee.name, type: employee.type},
    })
      .then(res => {
        if (res.data) {
          Toast.show({
            type: 'success',
            text1: _.capitalize(t('order.placed')),
            text2: t('order.success'),
            onPress: () => {
              Toast.hide();
            },
          });
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Tables',
              },
            ],
          });
        } else {
          Toast.show({
            type: 'error',
            text1: _.capitalize(t('order.error')),
            text2: t('order.failed'),
            onPress: () => {
              Toast.hide();
            },
          });
        }
      })
      .catch(err => {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: _.capitalize(t('order.error')),
          text2: t('order.failed'),
          onPress: () => {
            Toast.hide();
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={[utilStyles.h100, utilStyles.w100]}>
      <ScrollView style={[utilStyles.flex, utilStyles.pl2, utilStyles.pr2]}>
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="table-chair"
            size={24}
            color={COLORS.primary}
          />
          <View
            style={[
              utilStyles.ml4,
              {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <View>
              <Text
                style={[
                  globalStyles.p,
                  globalStyles.boldText,
                  utilStyles.capitalize,
                ]}>
                {t('table.0')}
              </Text>
              <Text style={[globalStyles.p]}>
                {cart.tables.map(table => table.name).join(', ')}
              </Text>
            </View>
            <View style={{width: 100}}>
              <TextInput
                style={styles.input}
                onChangeText={text => {
                  dispatch(
                    setCustomAttributes({
                      ...cart.custom_attributes,
                      no_of_guest: text,
                    }),
                  );
                }}
                value={cart.custom_attributes?.no_of_guest}
                placeholder={capitalize(t('noOfGuests'))}
                textAlign="center"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        {cart.price_category?.name ? (
          <View style={styles.card}>
            <MaterialCommunityIcons
              name="tag-text-outline"
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
                {cart.price_category.name}
              </Text>
              <Text style={[globalStyles.p, utilStyles.capitalize]}>
                {t('priceCategory')}
              </Text>
            </View>
          </View>
        ) : null}
        {cart.customer ? (
          <View style={styles.card}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={24}
              color={COLORS.primary}
            />
            <Pressable
              onPress={() => {
                dispatch(setCustomer(null));
              }}
              style={[
                utilStyles.flex,
                utilStyles.ml4,
                utilStyles.flexRow,
                utilStyles.justifyContentBetween,
                utilStyles.alignItemsCenter,
              ]}>
              <Text
                style={[
                  globalStyles.p,
                  globalStyles.boldText,
                  utilStyles.capitalize,
                ]}>
                {cart.customer.first_name} {cart.customer?.last_name}
              </Text>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={COLORS.primary}
              />
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={24}
              color={COLORS.primary}
            />
            <Pressable
              onPress={addCustomerAction}
              style={[
                utilStyles.flex,
                utilStyles.ml4,
                utilStyles.flexRow,
                utilStyles.justifyContentBetween,
                utilStyles.alignItemsCenter,
              ]}>
              <Text
                style={[
                  globalStyles.p,
                  globalStyles.boldText,
                  utilStyles.capitalize,
                ]}>
                {t('customer.1')}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={COLORS.primary}
              />
            </Pressable>
          </View>
        )}
        <FlatList
          data={cart.items}
          contentContainerStyle={[utilStyles.flexGrow, utilStyles.p2]}
          scrollEventThrottle={16}
          renderItem={renderItems}
          scrollToOverflowEnabled
          onEndReachedThreshold={1}
        />
        <View style={[styles.card]}>
          <View style={utilStyles.flex}>
            <Text
              style={[
                globalStyles.title,
                globalStyles.boldText,
                utilStyles.capitalize,
              ]}>
              {t('billDetails')}
            </Text>
            {renderRow(t('totalItem'), cart.items.length)}
            {renderRow(
              t('totalQuantity'),
              cart.items.reduce((sum, item) => {
                sum += item.quantity;
                return sum;
              }, 0),
            )}
            {renderRow(
              t('subtotal'),
              t('toCurrency', {
                value: cart.price.sub_total,
              }),
            )}
            {renderRow(
              t('tax.0'),
              t('toCurrency', {
                value: cart.price.tax.total,
              }),
            )}
            {renderRow(
              t('roundOff'),
              t('toCurrency', {
                value: cart.price.roundOff,
              }),
            )}
            {renderRow(
              t('charge'),
              t('toCurrency', {
                value: cart.price.charge.total,
              }),
            )}
            {cart.price.tip.total
              ? renderRow(
                  t('tip'),
                  t('toCurrency', {
                    value: cart.price.tip.total,
                  }),
                )
              : null}

            <View
              style={[
                utilStyles.flexGrow,
                utilStyles.flexRow,
                utilStyles.justifyContentBetween,
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
                  value: cart.price.total,
                })}
              </Text>
            </View>
          </View>
        </View>
        <View style={[utilStyles.my2, utilStyles.mx2]}>
          <Button
            action={placeOrderAction}
            label={t('placeOrder')}
            loading={loading}
            disabled={placeOrderDisabled}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  card: {
    elevation: 4,
    padding: 16,

    backgroundColor: COLORS.white,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 8,
    borderRadius: 8,
    minHeight: 60,

    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    height: 40,
    width: '100%',
    padding: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.primary,
  },
});

export default CartScreen;
