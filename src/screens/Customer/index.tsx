import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {SheetManager} from 'react-native-actions-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  View,
  Pressable,
  Text,
} from 'react-native';

import {Customers} from '../../types';
import CustomerCard from './CustomerCard';
import {RootState} from '../../redux/store';
import COLORS from '../../constants/colors';
import utilStyles from '../../styles/utils';
import colorStyles from '../../styles/colors';
import globalStyles from '../../styles/global';
import {setCustomer} from '../../redux/slices/cartSlice';
import {useGetCustomersMutation} from '../../services/api';

function Customer({navigation}): JSX.Element {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [customerApi] = useGetCustomersMutation();
  const customers: Customers = useSelector(
    (state: RootState) => state.waiter.customers,
  );

  const getCustomerData = useCallback(
    ({offset = 0, query = ''}) => {
      customerApi({
        offset,
        query,
      });
    },
    [customerApi],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        hideWhenScrolling: false,
        onChangeText: (event: any) => {
          getCustomerData({query: event.nativeEvent.text});
        },
      },
    });
  }, [getCustomerData, navigation]);

  useEffect(() => {
    getCustomerData({});
  }, [getCustomerData]);

  const onItemReachEnd = useCallback(() => {
    if (customers.list.length < customers.total) {
      getCustomerData({offset: customers.offset + 50});
    }
  }, [getCustomerData, customers]);

  const renderEmptyItems = () => (
    <View
      style={[
        utilStyles.flex,
        utilStyles.alignItemsCenter,
        utilStyles.justifyContentCenter,
        utilStyles.pb10,
      ]}>
      {customers.loading ? (
        <ActivityIndicator size={'large'} color={COLORS.primary} />
      ) : (
        <Text style={[globalStyles.p, utilStyles.capitalize]}>
          {t('noCustomersFound')}
        </Text>
      )}
    </View>
  );

  const renderItems = useCallback(({item, index}) => {
    return (
      <CustomerCard
        customer={item}
        index={index}
        selected={() => {
          dispatch(setCustomer(item));
          navigation.goBack();
        }}
      />
    );
  }, []);

  const addCustomerAction = async () => {
    const response = await SheetManager.show('customer-create', {});
    if (response) {
      navigation.goBack();
    }
  };

  return (
    <View style={{paddingTop: insets.top * (Platform.OS === 'ios' ? 3 : 1)}}>
      <FlatList
        data={customers.list}
        contentContainerStyle={[
          utilStyles.flexGrow,
          utilStyles.pl4,
          utilStyles.pr4,
          utilStyles.pt2,
        ]}
        scrollEventThrottle={16}
        renderItem={renderItems}
        scrollToOverflowEnabled
        ListEmptyComponent={renderEmptyItems()}
        onEndReachedThreshold={1}
        onEndReached={onItemReachEnd}
      />
      <Pressable style={styles.floatingButton} onPress={addCustomerAction}>
        <Text
          style={[
            utilStyles.p,
            colorStyles.white,
            utilStyles.textCenter,
            utilStyles.capitalize,
            utilStyles.px4,
          ]}>
          {t('addCustomer')}
        </Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    minWidth: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    elevation: 4,
    bottom: 16,
    right: 16,
    height: 42,
    justifyContent: 'center',
  },
});

export default Customer;
