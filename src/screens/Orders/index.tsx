import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import utilStyles from '../../styles/utils';
import COLORS from '../../constants/colors';
import {Order, TableOrder} from '../../types';
import {useGetTableOrdersMutation} from '../../services/api';
import OrderCard from './OrderCard';
import {Pressable} from 'react-native';
import colorStyles from '../../styles/colors';
import {setPriceCategory, setTables} from '../../redux/slices/cartSlice';
import {useIsFocused} from '@react-navigation/native';

function Orders({navigation, route}): JSX.Element {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [showAdd, setShowAdd] = useState<boolean>(true);

  const tableOrder: TableOrder = useSelector(
    (state: any) => state.waiter.tableOrder,
  );
  const [getTableOrderApi] = useGetTableOrdersMutation();

  const getOrders = useCallback(
    (offset = 0) => {
      getTableOrderApi({
        table_id: route.params.table.id,
        offset,
      });
    },
    [getTableOrderApi, route.params],
  );

  useEffect(() => {
    isFocused && getOrders(0);
  }, [getOrders, isFocused]);

  const onItemReachEnd = useCallback(() => {
    if (tableOrder.list.length < tableOrder.total) {
      getOrders({offset: tableOrder.offset + 50});
    }
  }, [getOrders, tableOrder]);

  const orderAction = (order: Order) => {
    navigation.navigate('OrderDetail', {order, table: route.params.table});
  };

  const renderItems = useCallback(({item, index}) => {
    return (
      <OrderCard
        order={item}
        index={index}
        action={() => {
          orderAction(item);
        }}
      />
    );
  }, []);

  const addAction = () => {
    dispatch(setPriceCategory(route.params.table.price_category));
    dispatch(setTables([route.params.table]));
    navigation.navigate('Items');
  };

  return (
    <SafeAreaView
      style={[
        utilStyles.flex,
        {paddingTop: insets.top, paddingBottom: insets.bottom},
      ]}>
      <FlatList
        data={tableOrder.list}
        contentContainerStyle={[
          utilStyles.flexGrow,
          utilStyles.pl4,
          utilStyles.pr4,
          utilStyles.pt2,
        ]}
        scrollEventThrottle={16}
        renderItem={renderItems}
        scrollToOverflowEnabled
        onEndReachedThreshold={1}
        onScroll={event => {
          setShowAdd(event.nativeEvent.contentOffset.y < 50);
        }}
        onEndReached={onItemReachEnd}
      />
      {showAdd ? (
        <Pressable style={styles.addContainer} onPress={addAction}>
          <Text
            style={[
              utilStyles.p,
              colorStyles.white,
              utilStyles.textCenter,
              utilStyles.capitalize,
              utilStyles.px4,
            ]}>
            {t('add')}
          </Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  addContainer: {
    position: 'absolute',
    minWidth: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    elevation: 4,
    bottom: 16,
    height: 42,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default Orders;
