import {Host} from '../types';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {RootState} from '../redux/store';
import {setMerchant} from '../redux/slices/serverSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'www.my-cool-site.com/',
  prepareHeaders: headers => {
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  },
});

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const host: Host | any = (api.getState() as RootState).server.host;
  const urlEnd = typeof args === 'string' ? args : args.url;
  const adjustedUrl = `http://${host?.ip}:${host?.port}/${urlEnd}`;
  const adjustedArgs =
    typeof args === 'string' ? adjustedUrl : {...args, url: adjustedUrl};
  const result = await rawBaseQuery(adjustedArgs, api, extraOptions);

  if (result.error && result.error.status !== 200) {
    api.dispatch(setMerchant(null));
  }
  return result;
};

export const api = createApi({
  reducerPath: 'waiterApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Availability'],
  endpoints: builder => ({
    merchantDetails: builder.mutation({
      query: () => ({
        url: 'api/v1/primary-device',
        method: 'GET',
      }),
    }),
    validateEmployee: builder.mutation({
      query: data => ({
        url: 'api/v1/passcode',
        method: 'POST',
        body: data,
      }),
    }),
    getFloors: builder.mutation({
      query: () => ({
        url: 'api/v1/get-floors',
        method: 'POST',
        data: {},
      }),
    }),
    getTables: builder.mutation({
      query: data => ({
        url: 'api/v1/get-tables',
        method: 'POST',
        body: data,
      }),
    }),
    getCategory: builder.mutation({
      query: data => ({
        url: 'api/v1/get-category',
        method: 'POST',
        body: data,
      }),
    }),
    getCustomers: builder.mutation({
      query: data => ({
        url: 'api/v1/get-customer',
        method: 'POST',
        body: data,
      }),
    }),
    queryCustomers: builder.mutation({
      query: data => ({
        url: 'api/v1/get-customer',
        method: 'POST',
        body: data,
      }),
    }),
    getItems: builder.mutation({
      query: data => ({
        url: 'api/v1/get-items',
        method: 'POST',
        body: data,
      }),
    }),
    getPriceCategory: builder.mutation({
      query: data => ({
        url: 'api/v1/price-category',
        method: 'POST',
        body: data,
      }),
    }),
    addToCart: builder.mutation({
      query: data => ({
        url: 'api/v1/add-to-cart',
        method: 'POST',
        body: data,
      }),
    }),
    placeOrder: builder.mutation({
      query: data => ({
        url: 'api/v1/place-order',
        method: 'POST',
        body: data,
      }),
    }),
    getTableOrders: builder.mutation({
      query: data => ({
        url: 'api/v1/get-table-orders',
        method: 'POST',
        body: data,
      }),
    }),
    orderStatusUpdate: builder.mutation({
      query: data => ({
        url: 'api/v1/update-order-status',
        method: 'POST',
        body: data,
      }),
    }),
    tableStatusUpdate: builder.mutation({
      query: data => ({
        url: 'api/v1/update-table-status',
        method: 'POST',
        body: data,
      }),
    }),
    editOrder: builder.mutation({
      query: data => ({
        url: 'api/v1/edit-order',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetItemsMutation,
  useEditOrderMutation,
  useGetFloorsMutation,
  useGetTablesMutation,
  useAddToCartMutation,
  usePlaceOrderMutation,
  useGetCategoryMutation,
  useGetCustomersMutation,
  useGetTableOrdersMutation,
  useQueryCustomersMutation,
  useMerchantDetailsMutation,
  useValidateEmployeeMutation,
  useGetPriceCategoryMutation,
  useOrderStatusUpdateMutation,
  useTableStatusUpdateMutation,
} = api;
