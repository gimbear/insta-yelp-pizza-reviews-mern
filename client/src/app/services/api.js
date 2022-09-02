import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { logOut } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4003/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
//*
const requireAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.originalStatus === 401) {
    api.dispatch(logOut());
  }
  return result;
};

export const api = createApi({
  baseQuery: requireAuth,
  tagTypes: ['Pizzas', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    protected: builder.mutation({
      query: () => 'protected',
    }),
  }),
});

export const { useLoginMutation, useProtectedMutation } = api;
