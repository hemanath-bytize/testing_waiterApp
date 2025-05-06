import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Passcode from '../screens/Passcode';
import Scan from '../screens/Scan';

const Stack = createNativeStackNavigator();

function AuthNavigator(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Scan" component={Scan} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
