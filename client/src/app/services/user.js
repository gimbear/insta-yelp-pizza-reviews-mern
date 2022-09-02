import { api } from './api';

export const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: 'signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUser: builder.query({
      query: (id) => `user/${id}`,
      providesTags: (_user, _err, id) => [{ type: 'User', id }],
    }),
    uploadFile: builder.mutation({
      async queryFn(file, _queryApi, _extraOptions, baseQuery) {
        //console.log(file);

        const formData = new FormData();
        formData.append('image', file);
        const response = await baseQuery(
          {
            url: 'user/upload',
            method: 'POST',
            body: formData,
          },
          _queryApi,
          _extraOptions
        );
        if (response.error) throw response.error;

        return response.data
          ? { newData: response.data }
          : { error: response.error };
      },
      invalidatesTags: [{ type: 'User' }],
    }),
  }),
});

export const {
  useSignupMutation,
  useGetUserQuery,
  useUploadFileMutation,
} = userSlice;
