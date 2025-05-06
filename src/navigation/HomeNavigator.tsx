import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import React, {useCallback, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Items from '../screens/Items';
import Tables from '../screens/Tables';
import Orders from '../screens/Orders';
import COLORS from '../constants/colors';
import CartScreen from '../screens/Cart';
import Passcode from '../screens/Passcode';
import Settings from '../screens/Settings';
import Customer from '../screens/Customer';
import OrderDetail from '../screens/Orders/Detail';
import {useTranslation} from 'react-i18next';
import {capitalize} from 'lodash';

const Stack = createNativeStackNavigator();

function HomeNavigator(): JSX.Element {
  const employee = useSelector(state => state.waiter?.employee);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const validateEmployee = useCallback(() => {
    if (!employee) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Passcode'}],
      });
    }
  }, []);
  useEffect(() => {
    validateEmployee();
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="Tables"
      screenOptions={() => ({
        headerShown: true,
      })}>
      <Stack.Screen
        name="Tables"
        component={Tables}
        options={({navigation}) => ({
          headerStyle: styles.header,
          title: capitalize(t('table.1')),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={({navigation}) => ({
          headerStyle: styles.header,
          title: t('settings'),
        })}
      />
      <Stack.Screen
        name="Items"
        component={Items}
        options={({navigation}) => ({
          headerStyle: styles.header,
          title: t('item.1'),
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={({navigation}) => ({
          headerStyle: styles.header,
          title: t('cart'),
        })}
      />
      <Stack.Screen
        name="Customer"
        component={Customer}
        options={() => ({
          headerStyle: styles.header,
          title: capitalize(t('customer.1')),
        })}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={() => ({
          headerStyle: styles.header,
          title: t('order.title.1'),
        })}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={() => ({
          headerStyle: styles.header,
          title: capitalize(t('orderDetails')),
        })}
      />
      <Stack.Screen
        name="Passcode"
        component={Passcode}
        options={() => ({
          headerStyle: styles.header,
          title: employee ? t('clockOut.title') : t('clockIn'),
        })}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.grey50,
  },
});
export default HomeNavigator;
