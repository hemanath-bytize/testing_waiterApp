import {Provider} from 'react-redux';
import {AppRegistry} from 'react-native';
import Toast, {ErrorToast, SuccessToast} from 'react-native-toast-message';

import './sheets.js';
import App from './App';
import {name as appName} from './app.json';
import {persistor, store} from './src/redux/store';
import {SheetProvider} from 'react-native-actions-sheet';
import {PersistGate} from 'redux-persist/integration/react';

const toastConfig = {
  success: props => (
    <SuccessToast
      {...props}
      style={{
        borderLeftColor: '#69C779',
        minHeight: 30,
      }}
      text2NumberOfLines={4}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#fc0303',
        minHeight: 30,
      }}
      text2NumberOfLines={4}
    />
  ),
};

AppRegistry.registerComponent(appName, () => () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SheetProvider>
        <App />
        <Toast config={toastConfig} />
      </SheetProvider>
    </PersistGate>
  </Provider>
));
