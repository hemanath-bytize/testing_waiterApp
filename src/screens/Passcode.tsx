import {t} from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {capitalize} from 'lodash';
import utilStyles from '../styles/utils';
import COLORS from '../constants/colors';
import colorStyles from '../styles/colors';
import globalStyles from '../styles/global';
import {setEmployee} from '../redux/slices/waiterSlice';
import {useValidateEmployeeMutation} from '../services/api';
import {defaultEmployee, staticIp} from '../utils/defaults';

function Passcode({navigation}): JSX.Element {
  const dispatch = useDispatch();
  const [validateEmployeeApi] = useValidateEmployeeMutation();

  const [passcode, setPasscode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState(null);

  const server = useSelector(state => state.server);
  const employee = useSelector(state => state.waiter?.employee);

  useEffect(() => {
    if (passcode.length === 4) {
      clockInOut();
    }
  }, [clockInOut, passcode]);

  const clockInOut = useCallback(() => {
    if (employee) {
      if (parseInt(passcode, 10) === employee.passkey) {
        dispatch(setEmployee(null));
        navigation.reset({
          index: 0,
          routes: [{name: 'Passcode'}],
        });
        Toast.show({
          type: 'success',
          text1: capitalize(t('clockOut.title')),
          text2: capitalize(t('clockOut.text')),
        });
      } else {
        setPasscode('');
        Toast.show({
          type: 'error',
          text1: capitalize(t('posscodeError.title')),
          text2: capitalize(t('posscodeError.text')),
        });
      }
    } else {
      if (server.host.ip === staticIp) {
        dispatch(setEmployee(defaultEmployee));
        navigation.reset({
          index: 0,
          routes: [{name: 'Tables'}],
        });
      } else {
        validateEmployeeApi({
          passcode,
          location_id: server.merchant.location.id,
        }).then(response => {
          if (response.error) {
            Toast.show({
              type: 'error',
              text1: capitalize(t('posscodeError.title')),
              text2: capitalize(t('posscodeError.text')),
            });
            setErrorMessage(
              response?.error?.data?.error?.message || 'Unauthorized',
            );
            setPasscode('');
          }
          navigation.reset({
            index: 0,
            routes: [{name: 'Tables'}],
          });
        });
      }
    }
  }, [
    dispatch,
    employee,
    navigation,
    passcode,
    server.host.ip,
    server.merchant.location.id,
    validateEmployeeApi,
  ]);

  const updatePasscode = (number: Number) => {
    setPasscode(`${passcode}${number}`);
    setErrorMessage(null);
  };
  const renderButton = (number: Number) => (
    <View style={[utilStyles.flex, utilStyles.alignItemsCenter, utilStyles.p2]}>
      <Pressable
        style={styles.button}
        disabled={passcode.length === 4}
        onPress={() => updatePasscode(number)}>
        <Text style={globalStyles.title}>{`${number}`}</Text>
      </Pressable>
    </View>
  );

  const handleDelete = () => {
    setPasscode('');
    setErrorMessage(null);
  };
  const renderDot = () => (
    <View style={[utilStyles.pt8, utilStyles.pb4, utilStyles.alignItemsCenter]}>
      <View style={[utilStyles.flexRow, utilStyles.mb4]}>
        <View
          style={[styles.dot, passcode.length > 0 ? styles.checked : null]}
        />
        <View
          style={[styles.dot, passcode.length > 1 ? styles.checked : null]}
        />
        <View
          style={[styles.dot, passcode.length > 2 ? styles.checked : null]}
        />
        <View
          style={[styles.dot, passcode.length > 3 ? styles.checked : null]}
        />
      </View>
      {errorMessage ? (
        <Text style={colorStyles.red}>{errorMessage}</Text>
      ) : null}
    </View>
  );
  return (
    <View
      style={[
        utilStyles.flex,
        utilStyles.alignItemsCenter,
        utilStyles.justifyContentCenter,
        utilStyles.p4,
      ]}>
      <View style={[styles.container]}>
        <MaterialCommunityIcons
          name="lock-outline"
          color={COLORS.primary}
          size={30}
        />
        <Text style={globalStyles.title}>{t('enterPasscode')}</Text>
        {renderDot()}

        <View style={utilStyles.flexRow}>
          {renderButton(1)}
          {renderButton(2)}
          {renderButton(3)}
        </View>
        <View style={utilStyles.flexRow}>
          {renderButton(4)}
          {renderButton(5)}
          {renderButton(6)}
        </View>
        <View style={utilStyles.flexRow}>
          {renderButton(7)}
          {renderButton(8)}
          {renderButton(9)}
        </View>
        <View style={utilStyles.flexRow}>
          <View style={[utilStyles.flex, utilStyles.alignItemsCenter]} />
          {renderButton(0)}
          <View
            style={[
              utilStyles.flex,
              utilStyles.justifyContentCenter,
              utilStyles.alignItemsCenter,
            ]}>
            {passcode.length ? (
              <Pressable onPress={handleDelete}>
                <MaterialCommunityIcons
                  name="backspace"
                  color={COLORS.red}
                  size={24}
                />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  buttonLayout: {width: 64, height: 64},
  button: {
    width: 64,
    height: 64,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  dot: {
    width: 16,
    height: 16,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 100,
    marginHorizontal: 8,
  },
  checked: {
    backgroundColor: COLORS.primary,
  },
});

export default Passcode;
