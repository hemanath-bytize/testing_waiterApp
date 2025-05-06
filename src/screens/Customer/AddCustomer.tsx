import React from 'react';
import * as yup from 'yup';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Pressable, Text, View} from 'react-native';
import {Field, Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import COLORS from '../../constants/colors';
import utilStyles from '../../styles/utils';
import {CustomInput} from '../../components/CustomInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colorStyles from '../../styles/colors';
import Button from '../../components/Button';
import {setCustomer} from '../../redux/slices/cartSlice';
import {useQueryCustomersMutation} from '../../services/api';
import {Alert} from 'react-native';
import {MerchantDetails} from '../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const phoneRegExp = /^[0-9\- ]{10}$/;
const customerSchema = yup.object().shape({
  first_name: yup.string().required('Fist Name is required'),
  last_name: yup.string(),
  phone: yup
    .string()
    .required('Mobile number is required')
    .matches(phoneRegExp, {message: 'Enter valid mobile number'}),
});
function AddCustomer(props): JSX.Element {
  const dispatch = useDispatch();
  const [customerApi] = useQueryCustomersMutation();
  const {t} = useTranslation();
  const merchantDetails: MerchantDetails = useSelector(
    (state: RootState) => state.server.merchant,
  );
  const submitAction = (values, {setErrors, resetForm}) => {
    customerApi({offset: 0, query: values.phone}).then(response => {
      if (response.data.data.list.length) {
        setErrors({phone: t('customerAlreadyExists.title')});
        Alert.alert(
          t('customerAlreadyExists.title'),
          t('customerAlreadyExists.message'),
          [
            {
              text: t('reset'),
              style: 'cancel',
              onPress: () => {
                resetForm();
              },
            },
            {
              text: t('continue'),
              style: 'destructive',

              onPress: () => {
                dispatch(setCustomer(response.data.data.list[0]));
                SheetManager.hide(props.sheetId, {
                  payload: {status: 'success'},
                });
              },
            },
          ],
        );
      } else {
        values.id = Number(values.phone);
        values.merchant_id = merchantDetails.id;
        values.updated_at = new Date();
        console.log('values', values);

        dispatch(setCustomer(values));
        SheetManager.hide(props.sheetId, {payload: {status: 'success'}});
      }
    });
  };
  return (
    <ActionSheet id={props.sheetId} snapPoints={[100]}>
      <View style={[utilStyles.p4, colorStyles.bgWhite]}>
        <Formik
          validationSchema={customerSchema}
          initialValues={{first_name: '', last_name: '', phone: ''}}
          onSubmit={submitAction}>
          {({
            values,
            touched,
            setTouched,
            errors,
            setFieldValue,
            setErrors,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
            validateForm,
          }) => (
            <>
              <Field
                component={CustomInput}
                label={'First Name'}
                containerStyle={[utilStyles.mb4]}
                placeholder={'Enter first name'}
                required={true}
                returnKeyType="next"
                value={values.first_name}
                maxLength={9}
                black
                cursorColor={COLORS.black}
                placeholderTextColor={COLORS.gray}
                error={touched.first_name && errors.first_name}
                onChangeText={handleChange('first_name')}
                onBlur={handleBlur('first_name')}
              />
              <Field
                component={CustomInput}
                label={'Last Name'}
                containerStyle={[utilStyles.mb4]}
                placeholder={'Enter last name'}
                required={false}
                returnKeyType="next"
                value={values.last_name}
                maxLength={9}
                black
                cursorColor={COLORS.black}
                placeholderTextColor={COLORS.gray}
                error={touched.last_name && errors.last_name}
                onChangeText={handleChange('last_name')}
                onBlur={handleBlur('last_name')}
              />
              <Field
                component={CustomInput}
                label={'Phone number'}
                containerStyle={[utilStyles.mb8]}
                placeholder={'Enter phone number'}
                required={true}
                inputMode={'tel'}
                returnKeyType="next"
                value={values.phone}
                maxLength={10}
                black
                cursorColor={COLORS.black}
                placeholderTextColor={COLORS.gray}
                error={touched.phone && errors.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
              />
              <Button
                label={t('submit')}
                action={handleSubmit}
                loading={false}
              />
            </>
          )}
        </Formik>
      </View>
    </ActionSheet>
  );
}

export default AddCustomer;
