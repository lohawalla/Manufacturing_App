import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { allotWorks, autoSelectSlip, findEmployee, findMachine, generateProductionSlip, getCurrentLogs, getCurrentSlips, getSuggestedEmployees, getSuggestedMachines, getTotalSlips, remainQuantity, scanProductionSlips } from "../API/productionSlip"
interface ProductionState {
    productionSlip: any[]; // Use the appropriate type here
    activeCurrentSlips: any[]; // Use the appropriate type here
    scannedSlips: any[]; // Use the appropriate type here
    suggestedMachines: any[]; // Use the appropriate type here
    suggestedEmployees: any[]; // Use the appropriate type here
    allotWork: any[]; // Use the appropriate type here
    qrEmployee: any[]; // Use the appropriate type here
    qrMachine: any[]; // Use the appropriate type here
    autoSelectSlip: any[]; // Use the appropriate type here
    activeCurrentLogs: any[]; // Use the appropriate type here
    status: string;
    totalSlip: [];
    remainQuantity: number;
}
const initialState: ProductionState = {
    productionSlip: [],
    activeCurrentSlips: [],
    scannedSlips: [],
    suggestedMachines: [],
    suggestedEmployees: [],
    allotWork: [],
    qrEmployee: [],
    qrMachine: [],
    autoSelectSlip: [],
    activeCurrentLogs: [],
    status: 'idle',
    totalSlip: [],
    remainQuantity: 0
}

export const generateProductionSlipAsync: any = createAsyncThunk(
    "generateProductionSlipAsync",
    async (val) => {
        console.log("data", val);
        try {
            const response = await generateProductionSlip(val);
            console.log("productionSloice", response);
            return response
        } catch (error) {
            return error
        }
    }
)


export const activeCurrentSlipAsync: any = createAsyncThunk(
    "activeCurrentSlipAsync",
    async (id, status) => {
        console.log("555555555555555555555", id, "inactive");
        try {
            const response = await getCurrentSlips(id, "inactive");
            return response
        } catch (error) {
            return error
        }
    }
)


export const totalSlipAsync: any = createAsyncThunk(
    "totalSlipAsync",
    async (selected) => {

        try {
            const response = await getTotalSlips(selected);
            return response
        } catch (error) {
            return error
        }
    }
)



export const scanProductionSlipAsync: any = createAsyncThunk(
    "scanProductionSlipAsync",
    async (slipNumber: string) => {
        console.log("8888888888888888888", slipNumber);
        try {
            const response = await scanProductionSlips(slipNumber);
            return response
        } catch (error) {
            console.log("error", error);
            return error
        }
    }
)


export const suggestedMachinesAsync: any = createAsyncThunk(
    "suggestedMachinesAsync",
    async (slipNumber: any) => {
        console.log("object", slipNumber);
        try {
            const response = await getSuggestedMachines(slipNumber)
            return response
        } catch (error) {
            return error
        }
    }
)


export const suggestedEmployeesAsync: any = createAsyncThunk(
    "suggestedEmployeesAsync",
    async (slipNumber: any) => {
        console.log("object", slipNumber);
        try {
            const response = await getSuggestedEmployees(slipNumber)
            return response
        } catch (error) {
            return error
        }
    }
)


export const allotWorkAsync = createAsyncThunk(
    "allotWorkAsync",
    async (val: any, { rejectWithValue }) => {
        console.log("object", val);
        try {
            const response = await allotWorks(val);
            if (response.status === 400) {
                const errorResponse = await response.json();
                return rejectWithValue(errorResponse);
            }
            return response;
        } catch (error) {
            throw (error);
        }
    }
);

export const findEmployeeAsync: any = createAsyncThunk(
    "findEmployeeAsync",
    async (data: any) => {
        console.log("I am calling here values dtaaaaa", data);
        try {
            const response = await findEmployee(data)
            return response
        } catch (error) {
            return error
        }
    }
)



export const findMachineAsync: any = createAsyncThunk(
    "findMachineAsync",
    async (data: any) => {
        console.log("I am calling here values dtaaaaa", data);
        try {
            const response = await findMachine(data)
            return response
        } catch (error) {
            return error
        }
    }
)



export const autoSelectSlipAsync: any = createAsyncThunk(
    "autoSelectSlipAsync",
    async (slipNumber: string) => {
        try {
            const response = await autoSelectSlip(slipNumber);
            console.log("20201180808", response);
            return response
        } catch (error) {
            return error
        }
    }
)

export const activeCurrentLogsAsync: any = createAsyncThunk(
    "activeCurrentLogsAsync",
    async (data) => {
        console.log("log isddsds----------on sliceefinal1", data);
        try {
            const response = await getCurrentLogs(data);
            console.log("res", response)
            return response
        } catch (error) {
            return error
        }
    }
)

export const getRemainingQuantityAsync: any = createAsyncThunk(
    "getRemainingQuantityAsync",
    async (data) => {
        try {
            const response = await remainQuantity(data);
            return response
        } catch (error) {
            throw error
        }
    }
)


export const ProductionSlice = createSlice({
    name: 'ProductionSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateProductionSlipAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(generateProductionSlipAsync.fulfilled, (state, action) => {
                console.log("7080149094", action.payload.productionSlip);
                state.status = 'fulfilled',
                    state.productionSlip = action.payload.productionSlip
            })
            .addCase(activeCurrentSlipAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(activeCurrentSlipAsync.fulfilled, (state, action) => {
                console.log("7080149094", action.payload.productionSlip);
                state.status = 'fulfilled',
                    state.activeCurrentSlips = action.payload.data
            })
            .addCase(scanProductionSlipAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(scanProductionSlipAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.scannedSlips = action.payload
            })
            .addCase(suggestedMachinesAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(suggestedMachinesAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.suggestedMachines = action.payload
            })
            .addCase(allotWorkAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(allotWorkAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.allotWork = action.payload.productionSlip
            })
            .addCase(findEmployeeAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(findEmployeeAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.qrEmployee = action.payload.employee
            })
            .addCase(autoSelectSlipAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(autoSelectSlipAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.autoSelectSlip = action.payload
            })
            .addCase(activeCurrentLogsAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(activeCurrentLogsAsync.fulfilled, (state, action) => {
                console.log("curre tlog caling", action.payload.result);
                state.status = 'fulfilled',
                    state.activeCurrentLogs = action.payload.result.resultWithPlanning
            })
            .addCase(findMachineAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(findMachineAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.qrMachine = action.payload.machine
            })
            .addCase(suggestedEmployeesAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(suggestedEmployeesAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.suggestedEmployees = action.payload.employee
                // [
                //     { "_id": '64cbb355de612350dfe13d23', "name": "JITENDRA","profilePic":"https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
                //     // Add more employees as needed
                // ];

            })
            .addCase(totalSlipAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(totalSlipAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.totalSlip = action.payload.data
            })
            .addCase(getRemainingQuantityAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getRemainingQuantityAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled',
                    state.remainQuantity = action.payload.remainingQuantity;
            })
    }
})
export default ProductionSlice.reducer