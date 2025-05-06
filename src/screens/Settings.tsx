import React from 'react';
import * as yup from 'yup';
import {Field, Formik} from 'formik';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import COLORS from '../constants/colors';
import utilStyles from '../styles/utils';
import Button from '../components/Button';
import globalStyles from '../styles/global';
import {CustomInput} from '../components/CustomInput';
import {saveSettings} from '../redux/slices/waiterSlice';
import {capitalize} from 'lodash';
import CustomPicker from '../components/CustomPicker';
import {version} from '../../package.json';

const locales = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'ar',
    label: 'عربي',
  },
  {
    value: 'fr',
    label: 'Français',
  },
  {
    value: 'de',
    label: 'Deutsch',
  },
  {
    value: 'es',
    label: 'Español',
  },
];

const ipAddressRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
const ipAddressSchema = yup.object().shape({
  printerIp: yup
    .string()
    .nullable()
    .notRequired()
    .matches(ipAddressRegex, {message: 'Enter a valid IP address'}),
  language: yup.string(),
});

function Settings(props: any): JSX.Element {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const printerIp = useSelector(
    (state: any) => state.waiter.settings.printer.ip,
  );
  const printerInterface = useSelector(
    (state: any) => state.waiter.settings.printer.interface,
  );
  const employee = useSelector(state => state.waiter?.employee);
  const language = useSelector(state => state.waiter?.settings?.locale) || 'en';
  const submitSettings = (values: any) => {
    dispatch(
      saveSettings({
        printer: {ip: values.printerIp, interface: values.printerInterface},
        locale: values.language,
      }),
    );
    props.navigation.goBack();
  };

  return (
    <View>
      <Formik
        validationSchema={ipAddressSchema}
        initialValues={{
          printerIp,
          printerInterface,
          language,
        }}
        onSubmit={submitSettings}>
        {({values, touched, errors, handleChange, handleSubmit}) => (
          <View style={{height: '100%', width: '100%'}}>
            {employee ? (
              <View style={[styles.employeeDetail, styles.mV]}>
                <View style={styles.mR}>
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    color={COLORS.primary}
                    size={24}
                  />
                </View>
                <View>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text>{employee.type && JSON.parse(employee.type).name}</Text>
                </View>
              </View>
            ) : null}
            <View style={[styles.employeeDetail, styles.mV]}>
              <View style={styles.mR}>
                <MaterialCommunityIcons
                  name="apps"
                  color={COLORS.primary}
                  size={24}
                />
              </View>
              <View>
                <Text style={styles.employeeName}>{t('appVersion')}</Text>
                <Text> {version}</Text>
              </View>
            </View>
            <View style={{paddingHorizontal: 15, paddingTop: 10}}>
              <Field
                component={CustomInput}
                keyboardType="numeric"
                label={capitalize(t('orderPrinterIp'))}
                labelStyle={[globalStyles.p, styles.textAlignLeft]}
                containerStyle={[utilStyles.mb4]}
                placeholder={'192.168.1.1'}
                returnKeyType="next"
                value={values.printerIp}
                black
                cursorColor={COLORS.black}
                placeholderTextColor={COLORS.gray}
                error={touched.printerIp && errors.printerIp}
                onChangeText={handleChange('printerIp')}
              />
            </View>
            <View style={{paddingHorizontal: 15, paddingTop: 10}}>
              <Field
                component={CustomPicker}
                items={['none', 'epson', 'star']}
                keyboardType="numeric"
                label={capitalize(t('orderPrinterType'))}
                labelStyle={[globalStyles.p, styles.textAlignLeft]}
                returnKeyType="next"
                value={values.printerInterface}
                black
                cursorColor={COLORS.black}
                placeholderTextColor={COLORS.gray}
                error={touched.printerInterface && errors.printerInterface}
                onChangeText={handleChange('printerInterface')}
              />
            </View>
            <View style={{paddingHorizontal: 15, paddingTop: 10}}>
              <Field
                component={CustomPicker}
                items={locales.map(item => item.label)}
                label={t('selectLanguage')}
                labelStyle={[globalStyles.p, styles.textAlignLeft]}
                returnKeyType="next"
                value={
                  locales.find(item => item.value === values.language)?.label
                }
                valueStyle={styles.textAlignLeft}
                black
                cursorColor={COLORS.black}
                placeholderTextColor={COLORS.gray}
                error={touched.language && errors.language}
                onChangeText={selectedLabel => {
                  const selectedLocale = locales.find(
                    item => item.label === selectedLabel,
                  )?.value;
                  handleChange('language')(selectedLocale);
                }}
              />
            </View>

            <View
              style={{
                position: 'absolute',
                width: '100%',
                bottom: 0,
                padding: 15,
              }}>
              <Button label={t('save')} action={handleSubmit} loading={false} />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
const styles = StyleSheet.create({
  employeeDetail: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mR: {
    marginRight: 10,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '700',
  },
  mV: {
    marginVertical: 10,
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  textAlignRight: {
    textAlign: 'right',
  },
});

export default Settings;
