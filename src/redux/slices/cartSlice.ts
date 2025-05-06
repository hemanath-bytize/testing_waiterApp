import {createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';
import {Cart} from '../../types/Cart';
import {useNavigation} from '@react-navigation/native';

const initialState: Cart = {
  price_category: null,
  items: [],
  price: {
    sub_total: 0,
    tax: {
      inclusive: 0,
      exclusive: 0,
      total: 0,
      taxes: [],
    },
    charge: {
      total: 0,
      charges: [],
    },
    discount: {
      sub_total: 0,
      tax: 0,
      total: 0,
      discounts: [],
    },
    total: 0,
    tip: {total: 0, type: 'fixed', amount: null},
  },
  customer: null,
  tables: [],
  order: null,
  custom_attributes: null,
  loading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTables: (state, action) => {
      state.tables = action.payload;
    },
    resetCart: (state, action) => {
      state.price_category = initialState.price_category;
      state.items = initialState.items;
      state.price = initialState.price;
      state.customer = initialState.customer;
      state.tables = initialState.tables;
      state.order = initialState.order;
      state.custom_attributes = initialState.custom_attributes;
    },
    setPriceCategory: (state, action) => {
      state.price_category = action.payload;
    },
    setItemNotes: (state, action) => {
      state.items = action.payload;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setCustomAttributes: (state, action) => {
      state.custom_attributes = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(api.endpoints.addToCart.matchPending, (state, action) => {
        const items = JSON.parse(JSON.stringify(state.items));
        const price_category = JSON.parse(JSON.stringify(state.price_category));
        let arg = {...action.meta.arg.originalArgs};
        action.meta.arg.originalArgs = {
          ...arg,
          items: items,
          price_category: price_category,
        };
      })
      .addMatcher(api.endpoints.addToCart.matchPending, state => {
        state.loading = true;
      })
      .addMatcher(api.endpoints.addToCart.matchFulfilled, (state, action) => {
        state.items = action.payload.data.items;
        state.price = action.payload.data.price;
        state.loading = false;
      })
      .addMatcher(api.endpoints.editOrder.matchFulfilled, (state, action) => {
        state.items = action.payload.data.items;
        state.price = action.payload.data.price;
      })
      .addMatcher(api.endpoints.placeOrder.matchPending, (state, action) => {
        const cart = JSON.parse(JSON.stringify(state));
        if (cart.order) {
          cart.order_id = cart.order.id;
          cart.order_status = cart.order.status;
          delete cart.order;
        }
        action.meta.arg.originalArgs = {
          ...cart,
          ...action.meta.arg.originalArgs,
        };
      })
      .addMatcher(api.endpoints.placeOrder.matchFulfilled, (state, action) => {
        if (action.payload?.status === 'success') {
          state = initialState;
        } else {
          console.log('action.playload.data', 'failed');
        }
      });
  },
});

export const {
  setTables,
  setItemNotes,
  resetCart,
  setPriceCategory,
  setCustomer,
  setOrder,
  setCustomAttributes,
} = cartSlice.actions;
export default cartSlice.reducer;
