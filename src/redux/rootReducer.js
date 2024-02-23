import workOrderSlice from "./Slice/workOrderSlice";
import machineSlice from "./Slice/machineSlice";
import productionSlice from "./Slice/productionSlice";
import { combineReducers } from "redux";
import { api } from "./features/rtkApi";

const workOrderReducer = workOrderSlice;
const machineReducer = machineSlice;
const productionReducer = productionSlice;


const rootReducer = combineReducers({
    workOrder: workOrderReducer,
    machine: machineReducer,
    production: productionReducer,
    [api.reducerPath]: api.reducer,
});

export default rootReducer;
