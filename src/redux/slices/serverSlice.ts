import {createSlice} from '@reduxjs/toolkit';

import {api} from '../../services/api';
import {serverInitialState} from '../../types';

const initialState: serverInitialState = {
  host: null,
  merchant: null,
};

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setHost: (state, action) => {
      state.host = action.payload;
    },
    setMerchant: (state, action) => {
      state.merchant = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      api.endpoints.merchantDetails.matchFulfilled,
      (state, action) => {
        if (action.payload.status === 'success') {
          state.merchant = action.payload.data['merchant-details'];
        } else {
          state.merchant = null;
        }
      },
    );
  },
});

export const {setHost, setMerchant} = serverSlice.actions;
export default serverSlice.reducer;
