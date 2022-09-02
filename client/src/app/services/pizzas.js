import { api } from './api';
//* https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#advanced-invalidation-with-abstract-tag-ids
export const pizzaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPizza: builder.query({
      query: () => 'pizza',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Pizzas',
                id: _id,
              })),
              { type: 'Pizzas', id: 'LIST' },
            ]
          : [{ type: 'Pizzas', id: 'LIST' }],
    }),
    //
    addPizza: builder.mutation({
      async queryFn(data, _queryApi, _extraOptions, baseQuery) {
        const formData = new FormData();
        for (let i = 0; i < data.myFiles.length; i++) {
          formData.append('image', data.myFiles[i]);
        }
        formData.append('pizzaTitle', data.pizzaTitle);
        formData.append('body', data.body);
        formData.append('rating', data.ratingValue);
        formData.append('cost', data.costValue);
        formData.append(
          'locationData',
          JSON.stringify(data.location)
        );
        const response = await baseQuery(
          {
            url: 'pizza/post',
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
      invalidatesTags: [{ type: 'Pizzas' }, { type: 'User' }],
    }),
    getPizzaById: builder.query({
      query: (id) => `pizza/${id}`,
      providesTags: (_pizza, _err, id) => [{ type: 'Pizzas', id }],
    }),
    updatePizza: builder.mutation({
      query(data) {
        const { id, ...newPizza } = data;
        //console.log(newPizza.data.removedFiles);
        const formData = new FormData();

        for (let i = 0; i < newPizza.data.myFiles.length; i++) {
          formData.append('image', newPizza.data.myFiles[i]);
        }

        formData.append(
          'oldFile',
          JSON.stringify(newPizza.data.removedFiles)
        );
        formData.append('_id', id);
        formData.append('pizzaTitle', newPizza.data.pizzaTitle);
        formData.append('body', newPizza.data.body);
        formData.append('rating', newPizza.data.ratingValue);
        formData.append('cost', newPizza.data.costValue);
        formData.append(
          'locationData',
          JSON.stringify(newPizza.data.location)
        );
        return {
          url: `pizza/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (pizza) => [
        { type: 'Pizzas', id: pizza?._id },
        { type: 'User' },
      ],
    }),
    deletePizza: builder.mutation({
      query(id) {
        return {
          url: `pizza/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (pizza) => [
        { type: 'Pizzas', id: pizza?._id },
        { type: 'User' },
      ],
    }),
  }),
});

export const {
  useAddPizzaMutation,
  useGetPizzaQuery,
  useGetPizzaByIdQuery,
  useUpdatePizzaMutation,
  useDeletePizzaMutation,
} = pizzaApi;

export const {
  endpoints: { getPost },
} = pizzaApi;
