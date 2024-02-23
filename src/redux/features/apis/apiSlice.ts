import { RootState, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import apis from '../../../components/apis';


const axiosBaseQuery = () => {
    return async ({ url, method, data, params }: any) => {
        try {
            const result = await apis({ url: url, method, data, params })
            return { data: result.data }
        } catch (axiosError) {
            let err: any = axiosError
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            }
        }
    }
}

const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getAllEmployees: builder.query({
            query: () => {
                return {
                    url: '/api/v1/productionSlip/getIdleActiveEmployees',
                    method: "GET",
                };
            },
            providesTags: ["apiSlice"],
        }),
        getAllSlips: builder.mutation({
            query: (initialPost) => (
                {
                    url: '/api/v1/productionSlip/getAll',
                    method: 'POST',
                    body: initialPost,
                }
            ),
        }),
        getAllMachines: builder.mutation({
            query: initialPost => ({
                url: '/api/v1/productionSlip/getIdleActiveMachines',
                method: 'POST',
                body: initialPost,
            }),
            invalidatesTags: ['Machines']
        }),
        getTotalSlips: builder.query({
            query: () => {
                return {
                    url: '/api/v1/productionSlip/getActive',
                    method: "GET",
                };
            },
            providesTags: ["totalSlip"],
        }),
        getSingleSlip: builder.query({
            query: (id) => ({
                url: `/api/v1/productionSlip/getProductionSlipDetail/${id}`,
                method: 'GET',
            }),
        }),
        getProfilePicture: builder.query({
            query: () => ({
                url: `/api/v1/auth/myprofile`,
                method: 'GET',
            }),
        }),
        getPreviousShopLogs: builder.query({
            query: () => ({
                url: `/api/v1/shop/getShopLog`,
                method: 'GET',
            }),
        }),
        getAllWorkOrders: builder.mutation({
            query: (initialPost) => {
                console.log("Inside query function - initialPost:", initialPost);
                return {
                    url: '/api/v1/workOrder/getWorkOrderApp',
                    method: 'POST',
                    body: {
                        sort: initialPost.selectedOption1,
                        minInventory: initialPost.selectedOption4 == 'true' ? true : false,
                        days: initialPost.selectedOption3,
                    },
                }
            },
        }),
        updateWorkOrder: builder.mutation({
            invalidatesTags: ["cancelWorkOrder"],
            query: (initial) => {
                console.log("Payload before API call:", initial);
                return {
                    url: '/api/v1/productionSlip/updateStatus',
                    method: 'PATCH',
                    body: initial,
                };
            },
        }),
    }),
    tagTypes: ["apiSlice", 'Machines', 'SingleSlipDetail', "totalSlip", "cancelWorkOrder"],
});

export const { useGetAllEmployeesQuery, useGetAllMachinesMutation, useGetTotalSlipsQuery, useGetSingleSlipQuery, useGetProfilePictureQuery, useGetPreviousShopLogsQuery, useGetAllWorkOrdersMutation, useGetAllSlipsMutation, useUpdateWorkOrderMutation } = apiSlice;

export default apiSlice;
