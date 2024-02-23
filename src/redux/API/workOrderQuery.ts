import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAllWorkOrdersApiPath, getSingleWorkOrderApiPath } from '../apiRoutes';


export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://chawlacomponents.com' }),
    endpoints: (builder) => ({
        getAllWorkOrders: builder.query({
            query: (option: any) => ({
                url: '/api/v1/workOrder/getWorkOrderApp',
                method: 'POST',
                body: { "sort": option.selectedOption1, "minInventory": option.selectedOption4 === 'true', "days": option.selectedOption3 },
            }),
        }),
        getSingleWorkOrder: builder.query({
            query: (id: string) => getSingleWorkOrderApiPath + `/${id}`,
        }),
    }),
});

export const { useGetAllWorkOrdersQuery, useGetSingleWorkOrderQuery } = api;

export default api;