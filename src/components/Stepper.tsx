import React from 'react';
import {useTranslation} from 'react-i18next';
import * as Progress from 'react-native-progress';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import COLORS from '../constants/colors';
import utilStyles from '../styles/utils';
import colorStyles from '../styles/colors';
import globalStyles from '../styles/global';

interface StepperProps {
  quantity: number;
  loading: boolean;
  minimum: number;
  maximum: number;
  incrementAction: any;
  decrementAction: any;
  action: object | any;
}

function Stepper({
  quantity,
  loading,
  minimum = 0,
  maximum = 10000,
  incrementAction,
  decrementAction,
  action = null,
}: StepperProps): JSX.Element {
  const {t} = useTranslation();
  const cartLoading: boolean = useSelector(
    (state: RootState) => state.cart.loading,
  );

  return (
    <View style={utilStyles.flex} pointerEvents={cartLoading ? 'none' : 'auto'}>
      {quantity > 0 ? (
        <View
          style={[
            styles.container,
            utilStyles.flex,
            utilStyles.alignItemsCenter,
            utilStyles.flexRow,
            utilStyles.justifyContentBetween,
          ]}>
          <Pressable
            disabled={quantity <= minimum}
            style={[
              styles.stepperButton,
              styles.stepperButtonLeft,
              quantity <= minimum ? colorStyles.bgGrey50 : null,
            ]}
            onPress={decrementAction}>
            <Text
              style={[
                globalStyles.p,
                globalStyles.boldText,
                utilStyles.uppercase,
                colorStyles.white,
              ]}>
              -
            </Text>
          </Pressable>
          <Text
            style={[
              globalStyles.p,
              globalStyles.boldText,
              utilStyles.uppercase,
              colorStyles.green30,
            ]}>
            {quantity}
          </Text>
          <Pressable
            style={[
              styles.stepperButton,
              styles.stepperButtonRight,
              quantity >= maximum ? colorStyles.bgGrey50 : null,
            ]}
            disabled={quantity >= maximum || cartLoading}
            onPress={incrementAction}>
            <Text
              style={[
                globalStyles.p,
                globalStyles.boldText,
                utilStyles.uppercase,
                colorStyles.white,
              ]}>
              +
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[
            styles.container,
            quantity >= maximum ? colorStyles.bgGrey50 : null,
          ]}
          disabled={quantity >= maximum || cartLoading}
          onPress={action ? action : incrementAction}>
          <View
            style={[
              utilStyles.flex,
              utilStyles.alignItemsCenter,
              utilStyles.justifyContentCenter,
            ]}>
            <Text
              style={[
                globalStyles.p,
                globalStyles.boldText,
                utilStyles.uppercase,
                colorStyles.green30,
              ]}>
              {t('add')}
            </Text>
          </View>
        </Pressable>
      )}

      <Progress.Bar
        width={100}
        height={1}
        indeterminate={loading}
        borderWidth={0}
        color={COLORS.green30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    elevation: 2,
    borderRadius: 4,
    flex: 1,
    // width: '100%',
    // height: '100%',
  },
  stepperButton: {
    width: 30,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green30,
  },
  stepperButtonLeft: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  stepperButtonRight: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});

const equal = (prev: any, next: any) => {
  return false;
};

export default React.memo(Stepper, equal);
