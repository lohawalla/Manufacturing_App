import { api } from "../rtkApi";

export const manufacturingApi: any = api.injectEndpoints({
    endpoints: (builder) => ({
        listGames: builder.query<any[], void>({
            providesTags: ['Game'],
            query: () => '/api/',
        }),
        updateGame: builder.mutation<string, { productionSlipNumbers: Partial<any>; status: string }>({
            invalidatesTags: ['Game'],
            query: (initial) => {
                console.log("Payload before API call:", initial);
                return {
                    body: initial,
                    method: 'PATCH',
                    url: '/api/v1/productionSlip/updateStatus',
                };
            },
        }),
        getAllEmployees: builder.query({
            query: () => {
                return {
                    url: '/api/v1/productionSlip/getIdleActiveEmployees',
                    method: "GET",
                };
            },
            providesTags: ["Game"],
        }),
        getAllSlips: builder.mutation({
            query: (initialPost: any) => (
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
            invalidatesTags: ['Game']
        }),
        getTotalSlips: builder.query({
            query: (initial) => {
                console.log(initial)
                return {
                    url: `/api/v1/productionSlip/getActive?status=${initial.completed ? initial.completed : initial}&date=${initial.selected ? initial.selected : ''}`,
                    method: "GET",
                };
            },
            providesTags: ["Game"],
        }),
        getSingleSlip: builder.query({
            query: (id: any) => ({
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
            query: (initialPost: any) => {
                console.log("Inside query function - initialPost:", initialPost);
                return {
                    url: '/api/v1/workOrder/getWorkOrderApp',
                    method: 'POST',
                    body: {
                        sort: initialPost.selectedOption1,
                        minInventory: '',
                        days: '',
                        status: ''
                    },
                }
            },
        }),
        getNegativeInventory: builder.mutation({
            query: (initial: any) => {
                return {
                    url: '/api/v1/inventory/workOrderNegativeCount',
                    method: 'POST',
                    body: {
                        jobProfileId: initial
                    }
                }
            }
        }),
        getChildPart: builder.query({
            query: (id: any) => {
                return {
                    url: `/api/v1/workOrder/${id}`,
                    method: "GET",
                }
            }
        }),
        getCountTotalSlips: builder.query({
            query: (initial) => {
                return {
                    url: `/api/v1/loadingBill/countTotalSlip?date=${initial.selected ? initial.selected : ''}`,
                    method: "GET",
                }
            }
        }),
        postChildPartOrder: builder.mutation({
            query: (initial: any) => {
                console.log(initial)
                return {
                    url: '/api/v1/productionSlip/addCompletedSlip',
                    method: "POST",
                    body: initial
                }
            }
        }),
        postActiveLogs: builder.mutation({
            query: (initial: any) => {
                console.log(initial);
                return {
                    url: `/api/v1/productionSlip/getAllChildPartWithSlip1/${initial.id}`,
                    method: 'POST',
                    body: {
                        "process": initial.selectedOption,
                        "minInventory": initial.selectedOption4 == 'true' ? true : false,
                        "days": initial.selectedOption3
                    }
                }
            }
        }),
        postMultipleSlips: builder.mutation({
            query: (initial: any) => {
                console.log(initial)
                return {
                    url: '/api/v1/productionSlip/multiProductionSlip',
                    method: 'POST',
                    body: {
                        productionSlipNumbers: initial
                    }
                }
            }
        }),
    }),
    overrideExisting: true,
})

export const { useListGamesQuery, useUpdateGameMutation, useGetAllEmployeesQuery, useGetAllMachinesMutation, useGetAllSlipsMutation, useGetAllWorkOrdersMutation, useGetPreviousShopLogsQuery, useGetProfilePictureQuery, useGetSingleSlipQuery, useGetTotalSlipsQuery, useGetNegativeInventoryMutation, useGetChildPartQuery, usePostChildPartOrderMutation, usePostActiveLogsMutation, usePostMultipleSlipsMutation, useGetCountTotalSlipsQuery } = manufacturingApi