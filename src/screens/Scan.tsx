import * as yup from 'yup';
import {Field, Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useMerchantDetailsMutation} from '../services/api';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {capitalize} from 'lodash';
import COLORS from '../constants/colors';
import utilStyles from '../styles/utils';
import Button from '../components/Button';
import globalStyles from '../styles/global';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import {CustomInput} from '../components/CustomInput';
import SuccessAnimation from '../animations/success.json';
import {defaultMerchant, staticIp} from '../utils/defaults';
import {setHost, setMerchant} from '../redux/slices/serverSlice';

const ipAddressRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
const ipAddressSchema = yup.object().shape({
  ip_address: yup
    .string()
    .required('Please enter the IP address of the main POS')
    .matches(ipAddressRegex, {message: 'Enter valid ip address'}),
});

function Scan(): JSX.Element {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const waiter = useSelector(state => state.waiter);
  const server = useSelector(state => state.server);
  const [showLoading, setShowLoading] = useState(false);
  const [merchantDetailsApi] = useMerchantDetailsMutation();
  const [ip, setIp] = useState(null);
  const [connectPos, setConnectPos] = useState(false);

  const getMerchantDetails = useCallback(async () => {
    if (server.host.ip === staticIp) {
      dispatch(setMerchant(defaultMerchant));
    } else {
      setConnectPos(true);
      merchantDetailsApi({})
        .then(response => {
          if (response.error) {
            Toast.show({
              type: 'error',
              text1: capitalize(t('unableToConnect.title')),
              text2: capitalize(t('unableToConnect.text')),
            });
          }
        })
        .catch(console.error)
        .finally(() => {
          setConnectPos(false);
        });
    }
  }, [dispatch, merchantDetailsApi, server?.host?.ip, t]);

  const submitIp = (values: any) => {
    dispatch(setHost({ip: values.ip_address, port: 3345}));
  };

  useEffect(() => {
    if (server.host) {
      getMerchantDetails();
    }
  }, [server.host]);

  return (
    <ScrollView
      contentContainerStyle={[
        utilStyles.flex,
        utilStyles.alignItemsCenter,
        utilStyles.justifyContentCenter,
      ]}>
      {connectPos ? (
        <View style={[utilStyles.alignItemsCenter]}>
          {waiter.merchant ? (
            <LottieView
              source={SuccessAnimation}
              autoPlay
              loop={false}
              style={{width: 150, height: 150}}
            />
          ) : (
            <>
              <ActivityIndicator size={'large'} color={COLORS.primary} />
              <Text
                style={[globalStyles.p, utilStyles.mt4, utilStyles.capitalize]}>
                {t('connectingToMainPos')}
              </Text>
            </>
          )}
        </View>
      ) : (
        <Formik
          validationSchema={ipAddressSchema}
          initialValues={{ip_address: ip || ''}}
          onSubmit={submitIp}
          enableReinitialize>
          {({values, touched, errors, handleChange, handleSubmit}) => (
            <View style={{width: '75%'}}>
              <Field
                component={CustomInput}
                keyboardType="numeric"
                label={capitalize(t('mainPOSIpAddress'))}
                containerStyle={[utilStyles.mb4]}
                placeholder={'192.168.1.1'}
                required={true}
                returnKeyType="next"
                value={values.ip_address}
                black
                cursorColor={COLORS.black}
                placeholderTextColor={COLORS.gray}
                error={touched.ip_address && errors.ip_address}
                onChangeText={handleChange('ip_address')}
              />
              {!values.ip_address?.length && server.host?.ip ? (
                <View style={utilStyles.alignItemsCenter}>
                  <TouchableOpacity
                    onPress={() => {
                      setIp(server.host?.ip);
                    }}
                    style={styles.hint}>
                    <Text style={styles.hintText}>use {server.host?.ip}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              <Button
                label={t('connect')}
                action={handleSubmit}
                loading={showLoading}
              />
            </View>
          )}
        </Formik>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  hint: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: '70%',
  },
  hintText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
export default Scan;
