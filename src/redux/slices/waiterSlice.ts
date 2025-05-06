import {createSlice} from '@reduxjs/toolkit';
import {api} from '../../services/api';
import {
  Customers,
  PriceCategories,
  Variations,
  WaiterInitialState,
} from '../../types';

const initialState: WaiterInitialState = {
  employee: null,
  floors: [],
  tables: {
    list: [],
    loading: true,
    offset: 0,
    total: 0,
  },
  categories: {list: [], loading: true, offset: 0, total: 0},
  selectedFloor: null,
  selectedCategory: {
    id: null,
    name: 'All',
    no_of_category: 0,
    parent: null,
    is_active: true,
  },
  variations: {list: [], loading: true, offset: 0, total: 0},
  priceCategories: {list: [], loading: true, offset: 0, total: 0},
  customers: {list: [], loading: true, offset: 0, total: 0},
  tableOrder: {list: [], loading: true, offset: 0, total: 0},
  settings: {
    printer: {
      ip: null,
      interface: 'none',
    },
    locale: 'en',
  },
};

const waiterSlice = createSlice({
  name: 'waiter',
  initialState,
  reducers: {
    setFloor: (state, action) => {
      state.selectedFloor = action.payload;
    },
    setFloors: (state, action) => {
      state.floors = action.payload;
    },
    updateTable: (state, action) => {
      state.tables = action.payload;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setVariations: (state, action) => {
      state.variations = action.payload;
    },
    resetVariations: state => {
      state.variations = initialState.variations;
    },
    saveSettings: (state, action) => {
      state.settings = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
    setPriceCategory: (state, action) => {
      state.priceCategories = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        api.endpoints.validateEmployee.matchFulfilled,
        (state, action) => {
          if (action.payload.status === 'success') {
            state.employee = action.payload.data.employee;
          }
        },
      )
      .addMatcher(api.endpoints.getFloors.matchFulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          state.floors = action.payload.data.list;
          if (action.payload.data.list.length) {
            state.selectedFloor = action.payload.data.list[0];
          }
        }
      })
      .addMatcher(api.endpoints.getTables.matchFulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          state.tables = action.payload.data;
        }
      })
      .addMatcher(
        api.endpoints.getCustomers.matchFulfilled,
        (state, action) => {
          if (action.payload.status === 'success') {
            const customers: Customers = action.payload.data;
            state.customers = {
              list:
                customers.offset > 0
                  ? state.customers.list.concat(customers.list)
                  : customers.list,
              loading: customers.loading,
              offset: customers.offset,
              total: customers.total,
            };
          }
        },
      )
      .addMatcher(api.endpoints.getItems.matchPending, (state, action) => {
        if (action.meta.arg.originalArgs.offset === 0) {
          state.variations = initialState.variations;
        }
      })
      .addMatcher(api.endpoints.getItems.matchFulfilled, (state, action) => {
        if (action.payload.status === 'success') {
          const variations: Variations = action.payload.data;
          state.variations = {
            list:
              variations.offset > 0
                ? state.variations.list.concat(variations.list)
                : variations.list,
            loading: variations.loading,
            offset: variations.offset,
            total: variations.total,
          };
        }
      })
      .addMatcher(
        api.endpoints.getPriceCategory.matchPending,
        (state, action) => {
          if (action.meta.arg.originalArgs.offset === 0) {
            state.priceCategories = initialState.priceCategories;
          }
        },
      )
      .addMatcher(
        api.endpoints.getPriceCategory.matchFulfilled,
        (state, action) => {
          if (action.payload.status === 'success') {
            const priceCategories: PriceCategories = action.payload.data;
            state.priceCategories = {
              list:
                priceCategories.offset > 0
                  ? state.priceCategories.list.concat(priceCategories.list)
                  : priceCategories.list,
              loading: priceCategories.loading,
              offset: priceCategories.offset,
              total: priceCategories.total,
            };
          }
        },
      )
      .addMatcher(
        api.endpoints.getTableOrders.matchPending,
        (state, action) => {
          if (action.meta.arg.originalArgs.offset === 0) {
            state.tableOrder = initialState.tableOrder;
          }
        },
      )
      .addMatcher(
        api.endpoints.getTableOrders.matchFulfilled,
        (state, action) => {
          if (action.payload.status === 'success') {
            const tableOrder = action.payload.data;
            state.tableOrder = {
              list:
                tableOrder.offset > 0
                  ? state.tableOrder.list.concat(tableOrder.list)
                  : tableOrder.list,
              loading: tableOrder.loading,
              offset: tableOrder.offset,
              total: tableOrder.total,
            };
          }
        },
      );
  },
});

export const {
  setFloor,
  setFloors,
  updateTable,
  setCategory,
  setVariations,
  resetVariations,
  saveSettings,
  setCategories,
  setEmployee,
} = waiterSlice.actions;
export default waiterSlice.reducer;
