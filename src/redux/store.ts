import thunk from 'redux-thunk';
import {persistReducer, persistStore} from 'redux-persist';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {api} from '../services/api';
import cartReducer from './slices/cartSlice';
import serverReducer from './slices/serverSlice';
import waiterReducer from './slices/waiterSlice';

const waiterPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['employee', 'settings'],
};
const serverPersistConfig = {
  key: 'server',
  storage: AsyncStorage,
  whitelist: ['host'],
};
const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
  waiter: persistReducer(waiterPersistConfig, waiterReducer),
  server: persistReducer(serverPersistConfig, serverReducer),
  cart: cartReducer,
});

export const store = configureStore({
  reducer,
  middleware: [thunk, api.middleware],
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;