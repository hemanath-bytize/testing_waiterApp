import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Passcode from '../screens/Passcode';

const Stack = createNativeStackNavigator();

function PasscodeNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Passcode" component={Passcode} />
    </Stack.Navigator>
  );
}

export default PasscodeNavigator;
