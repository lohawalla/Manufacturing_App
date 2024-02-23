import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createLogs, employeeProductivity, fetchProfile, getAllCncLogs, getAllEmployees, getAllMachine, getAllPrograms, getShopLog, singleEmployeeDetails } from "../API/machine";
import { createLogsApiPath } from "../apiRoutes";

const initialState = {
    allMachines: [],
    allEmployees: [],
    cncLogs: [],
    programs: [],
    status: 'idle',
    createLog: [],
    personalData: [],
    singleEmployeeDetails: [],
    empProductivity: [],
    shopLog: [],
}

type ApiFunction = () => Promise<any>;

const fetchWithRetry = async (apiFunction: ApiFunction, retires = 3) => {
    for (let i = 0; i < retires; i++) {
        try {
            return await apiFunction();
        } catch (error) {
            if (i == retires - 1) {
                throw error
            }
        }
    }
}

export const getMachinesAsync: any = createAsyncThunk(
    "getMachinesAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response: any = await fetchWithRetry(getAllMachine);
            return response
        } catch (error) {
            return rejectWithValue(error || "An error occurred")
        }
    }
)


export const getEmployeeAsync: any = createAsyncThunk(
    "getEmployeeAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(getAllEmployees);
            return response
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)


export const getCncLogsAsync: any = createAsyncThunk(
    "getCncLogs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(getAllCncLogs);
            return response
        } catch (error) {
            return rejectWithValue(error || "An Error occurred")
        }
    }
)

export const getAllProgramsAsync: any = createAsyncThunk(
    "getAllProgramsAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(getAllPrograms);
            return response
        } catch (error) {
            return rejectWithValue(error || "An Error occurred")
        }
    }
)


export const getPersonalAsync: any = createAsyncThunk(
    "getPersonalAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchWithRetry(fetchProfile);
            return response
        } catch (error) {
            return rejectWithValue(error || "An Error occurred")
        }
    }
)

export const createLogAsync: any = createAsyncThunk(
    "createLogAsync",
    async ({ id, data }: any, { rejectWithValue }) => {
        console.log(id, data)
        try {
            const response = await createLogs(id, data);
            console.log(id, response)
            return response
        } catch (error) {
            return rejectWithValue(error || "An Error occurred")
        }
    }
)

export const getPunchandPunchOut: any = createAsyncThunk(
    "getPunchandPunchOut",
    async (id: any, { rejectWithValue }) => {
        console.log(id)
        try {
            const response = await singleEmployeeDetails(id);
            console.log(id, response)
            return response
        } catch (error) {
            return rejectWithValue(error || "An Error occurred")
        }
    }
)

export const empProductivityAsync: any = createAsyncThunk(
    "empProductivityAsync",
    async (id: any, { rejectWithValue }) => {
        const ids = id.arr;
        const Date = id.date;
        try {
            const response = await employeeProductivity(ids, Date);
            console.log(id, response)
            return response
        } catch (error) {
            return rejectWithValue(error || "An Error occurred")
        }
    }
)


export const getPreviousShopLoogAsync: any = createAsyncThunk(
    "getPreviousShopLoogAsync",
    async () => {
        try {
            const response = await fetchWithRetry(getShopLog);
            return response
        } catch (error) {
            throw error;
        }
    }
)


export const MachineSlice = createSlice({
    name: "MachineSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMachinesAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getMachinesAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.allMachines = action.payload.machineArray
            })
            .addCase(getEmployeeAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getEmployeeAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.allEmployees = action.payload.employeeArray;
            })
            .addCase(getCncLogsAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getCncLogsAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.cncLogs = action.payload.result.logs
            })
            .addCase(getAllProgramsAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getAllProgramsAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.programs = action.payload.result.result
            })
            .addCase(createLogAsync.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(createLogAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.createLog = action.payload.programLog
            })
            .addCase(getPersonalAsync.pending, (state, action) => {
                state.status = 'pending'
            })
            .addCase(getPersonalAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.personalData = action.payload
            })
            .addCase(getPunchandPunchOut.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getPunchandPunchOut.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.singleEmployeeDetails = action.payload.data
            })
            .addCase(empProductivityAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(empProductivityAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.empProductivity = action.payload.result
            })
            .addCase(getPreviousShopLoogAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(getPreviousShopLoogAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.shopLog = action.payload.shopLog
            })
    }
})

export default MachineSlice.reducer