import { Suspense, lazy } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Dashboard from "./src/screens/Dashboard/Dashboard";
const Cam = lazy(() => import("./src/components/Camera/Camera"));
const GenerateSlip = lazy(() => import("./src/components/generateSlip/generateSlip"));
const LanguageSwitch = lazy(() => import("./src/locals/LangaugeSwitch"));
const CompletedSlips = lazy(() => import("./src/screens/Dashboard/CompletedSlips/CompletedSlips"));
const Completed = lazy(() => import("./src/screens/DaySlips/Completed"));
const Employees = lazy(() => import("./src/screens/Employees/Employes"));
const Productivity = lazy(() => import("./src/screens/Employees/Productivity"));
const Machine = lazy(() => import("./src/screens/Machine/Machine"));
const EditEmployeeCamera = lazy(() => import("./src/screens/RunningSlip/EditAlotment/Camera/EditEmployeeCamera"));
const EditMachineCamera = lazy(() => import("./src/screens/RunningSlip/EditAlotment/Camera/EditMachineCamera"));
const EditAlotment = lazy(() => import("./src/screens/RunningSlip/EditAlotment/EditAlotment"));
const LogProduction = lazy(() => import("./src/screens/RunningSlip/LogProduction/LogProduction"));
const RunningSlip = lazy(() => import("./src/screens/RunningSlip/RunningSlip"));
const ScannedSlip = lazy(() => import("./src/screens/ScannedSlip/ScannedSlip"));
const ScannedSlipCamera = lazy(() => import("./src/screens/ScannedSlip/ScannedSlipCamera"));
const ScannedSlipMachinesCamera = lazy(() => import("./src/screens/ScannedSlip/ScannedSlipMachinesCamera"));
const WorkOrder = lazy(() => import("./src/screens/WorkOrder/WorkOrder"));
const CureentSlips = lazy(() => import("./src/screens/singleWorkOrder/CurrentSlips/CureentSlips"));
const SingleWorkOrder = lazy(() => import("./src/screens/singleWorkOrder/SingleWorkOrder"));
const SingleLogs = lazy(() => import("./src/screens/singleWorkOrder/Logs/SingleLogs/SingleLogs"));
const Program = lazy(() => import("./src/screens/ProgramLogs/Program"));
const SingleProgramLogs = lazy(() => import("./src/screens/ProgramLogs/SingleProgramLogs"));
const ProgramMachineCamera = lazy(() => import("./src/screens/ProgramLogs/Camera/ProgramMachineCamera"));
const ProgramEmployeeCamera = lazy(() => import("./src/screens/ProgramLogs/Camera/ProgramEmployeeCamera"));
const DailyLogs = lazy(() => import("./src/screens/ProgramLogs/DailyLogs"));
import AnimatedLoader from "./src/components/AnimatedLoader/AnimatedLoader";
const LazyLoadingWrapper = ({ children }) => (
    <Suspense fallback={<AnimatedLoader />}>{children}</Suspense>
);
const Stack = createNativeStackNavigator();
const Home = () => {
    return (
        <LazyLoadingWrapper>
            <Stack.Navigator initialRouteName="dashboard">
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="dashboard"
                    component={Dashboard}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Camera"
                    component={Cam}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Machine"
                    component={Machine}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Employees"
                    component={Employees}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="ScannedSlip"
                    component={ScannedSlip}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="ScannedSlipCamera"
                    component={ScannedSlipCamera}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="ScannedSlipMachinesCamera"
                    component={ScannedSlipMachinesCamera}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="RunningSlip"
                    component={RunningSlip}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="EditAlotment"
                    component={EditAlotment}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="LogProduction"
                    component={LogProduction}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="GenerateSlip"
                    component={GenerateSlip}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="CurrentSlip"
                    component={CureentSlips}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="EditEmployeeCamera"
                    component={EditEmployeeCamera}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="EditMachineCamera"
                    component={EditMachineCamera}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="CompletedSlip"
                    component={CompletedSlips}
                />
                {/* <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SingleProgramLogs"
          component={SingleProgramLogs}
        /> */}
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Language"
                    component={LanguageSwitch}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Productivity"
                    component={Productivity}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Completed"
                    component={Completed}
                />
            </Stack.Navigator>
        </LazyLoadingWrapper>
    );
};

export default Home

export const Work = () => {
    return (
        <LazyLoadingWrapper>
            <Stack.Navigator initialRouteName="Work">
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Work"
                    component={WorkOrder}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="WorkOrder"
                    component={SingleWorkOrder}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="SingleLogs"
                    component={SingleLogs}
                />
            </Stack.Navigator>
        </LazyLoadingWrapper>
    )
}

export const Programs = () => {
    return (
        <LazyLoadingWrapper>
            <Stack.Navigator initialRouteName="Program">
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="Program"
                    component={Program}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="SingleProgramLogs"
                    component={SingleProgramLogs}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="ProgramMachineCamera"
                    component={ProgramMachineCamera}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="ProgramEmployeeCamera"
                    component={ProgramEmployeeCamera}
                />
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="DailyLogs"
                    component={DailyLogs}
                />
            </Stack.Navigator>
        </LazyLoadingWrapper>
    )
}