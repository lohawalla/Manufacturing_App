import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { editProduction, getAllWorkOrder, getLogsReport, getNegative, getRandomThoughts, getSingleWorkOrder, getSlipsOneDetail, getWorkOrderByChildPart, getWorkOrderByChildPartByWorkOrder, shiftTimingsAsync } from "../API/workOrder";
import { getShopShiftTimingsReportApiPath, getWorkOrderByChildPartApiPath } from "../apiRoutes";

const initialState = {
    allWorkOrders: [],
    singleWorkOrders: [],
    status: 'idle',
    editedProduction: [],
    childPartWorkOrders: [],
    WorkOrderByChildPartByWorkOrder: [],
    SlipsDetail: [],
    NegativeInventory: 0,
    dailyLogs: [],
    shift: [],
    thoughts: [],
}

export const getAllWorkOrderAsync: any = createAsyncThunk(
    "getAllWorkOrderAsync",
    async (option) => {
        try {
            const response: any = await getAllWorkOrder(option);
            return response;
        } catch (error) {
            return error
        }
    }
)


export const getSingleWorkOrderAsync: any = createAsyncThunk(
    "getSingleWorkOrderAsync",
    async (id: string) => {
        try {
            const response: any = await getSingleWorkOrder(id);
            console.log("akashchaurasiya", response);
            return response
        } catch (error) {
            return error
        }
    }
)


export const editProductionAsync: any = createAsyncThunk(
    "editProductionAsync",
    async ({ productionSlipNumber, apiData }: any) => {
        try {
            console.log(productionSlipNumber, apiData);
            const response: any = await editProduction(productionSlipNumber, apiData)
            return response
        } catch (error) {
            return error
        }
    }
)

export const childPartWorkOrderAsync: any = createAsyncThunk(
    "childPartWorkOrderAsync",
    async (id: any) => {
        try {
            console.log(id);
            const response: any = await getWorkOrderByChildPart(id);
            return response
        } catch (error) {
            throw error;
        }
    }
)

export const getWorkOrderByChildPartByWorkOrderAsync: any = createAsyncThunk(
    "getWorkOrderByChildPartByWorkOrderAsync",
    async (val: any) => {
        try {
            console.log(val);
            const response: any = await getWorkOrderByChildPartByWorkOrder(val);
            console.log(response);
            return response
        } catch (error) {
            throw error;
        }
    }
)

export const getSlipsOneDetailAsync: any = createAsyncThunk(
    "getSlipsOneDetailAsync",
    async (id: any) => {
        try {
            const response: any = await getSlipsOneDetail(id);
            return response
        } catch (error) {
            throw error;
        }
    }
)

export const getNegativeAsync: any = createAsyncThunk(
    "getNegativeAsync",
    async (id: any) => {
        try {
            const response: any = await getNegative(id)
            return response
        } catch (error) {
            throw error
        }
    }
)

export const getDailyLogsReportAsync: any = createAsyncThunk(
    "getDailyLogsReportAsync",
    async (details) => {
        console.log(details)
        try {
            const response: any = await getLogsReport(details);
            return response
        } catch (error) {
            throw error;
        }
    }
)

//shift timings

export const getShiftTimingsAsync: any = createAsyncThunk(
    "getShiftTimingsAsync",
    async (details) => {
        try {
            const response = await shiftTimingsAsync(details);
            return response
        } catch (error) {
            throw error;
        }
    }
)


export const getRandomThoughtsAsync: any = createAsyncThunk(
    "getRandomThoughtsAsync",
    async () => {
        try {
            const response = await getRandomThoughts();
            return response
        } catch (error) {
            throw error;
        }
    }
)

export const WorkOrderSlice = createSlice({
    name: "WorkOrderSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllWorkOrderAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getAllWorkOrderAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.allWorkOrders = action.payload.workOrder
            })
            .addCase(getSingleWorkOrderAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getSingleWorkOrderAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.singleWorkOrders = action.payload.workOrder
            })
            .addCase(editProductionAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(editProductionAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.editedProduction = action.payload.productionSlip
            })
            .addCase(childPartWorkOrderAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(childPartWorkOrderAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.childPartWorkOrders = action.payload.data
            })
            .addCase(getWorkOrderByChildPartByWorkOrderAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getWorkOrderByChildPartByWorkOrderAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.WorkOrderByChildPartByWorkOrder = action.payload.result;
            })
            .addCase(getSlipsOneDetailAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getSlipsOneDetailAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.SlipsDetail = action.payload.result;
            })
            .addCase(getNegativeAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getNegativeAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.NegativeInventory = action.payload.cardData;
            })
            .addCase(getDailyLogsReportAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getDailyLogsReportAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.dailyLogs = action.payload;
            })
            .addCase(getShiftTimingsAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getShiftTimingsAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                    state.shift = action.payload;
            })
            .addCase(getRandomThoughtsAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getRandomThoughtsAsync.fulfilled, (state, action) => {
                state.status = 'idle',
                state.thoughts = action.payload;
            })
    }
})
export default WorkOrderSlice.reducer