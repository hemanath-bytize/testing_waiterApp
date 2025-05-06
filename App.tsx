import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CodePush from 'react-native-code-push';
import {useSelector} from 'react-redux';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import './src/localization/i18n';
import AuthNavigator from './src/navigation/AuthNavigator';
import HomeNavigator from './src/navigation/HomeNavigator';
import NavigationHandler from './src/navigation/NavigationHandler';
import {changeLanguage} from 'i18next';
function App(): JSX.Element {
  const navigationRef = useNavigationContainerRef();
  const merchant = useSelector(state => state.server?.merchant);
  const language = useSelector(state => state.waiter?.settings?.locale);
  useEffect(() => {
    CodePush.sync({
      rollbackRetryOptions: {delayInHours: 0},
      updateDialog: {
        title: 'Update Available',
        mandatoryUpdateMessage:
          'When you click on continue the update will be automatically installed ',
      },
      installMode: CodePush.InstallMode.IMMEDIATE,
    });
  }, []);

  useEffect(() => {
    changeLanguage(language);
  }, [language]);
  
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          NavigationHandler.setTopLevelNavigator(navigationRef);
        }}>
        {merchant ? <HomeNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
