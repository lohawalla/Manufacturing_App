// apiService.js
import { useDispatch } from 'react-redux';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { getEmployeeAsync, getMachinesAsync } from '../../redux/Slice/machineSlice';
import { totalSlipAsync } from '../../redux/Slice/productionSlice';

export const fetchData = async (selected:any, setTotalSlipLoading:any, setShow:any, setLastRefreshed:any) => {
    const dispatch=useDispatch()
    setTotalSlipLoading(true);
    try {
        const machinesResponse = await dispatch(getMachinesAsync());
        handleApiResponse(machinesResponse, 'Machines');
        const employeeResponse = await dispatch(getEmployeeAsync());
        handleApiResponse(employeeResponse, 'Employee');
        const totalSlipResponse = await dispatch(totalSlipAsync(selected));
        handleApiResponse(totalSlipResponse, 'Total Slip');
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setTotalSlipLoading(false);
        setShow(false);
        setLastRefreshed(new Date());
    }
};

export const handleApiResponse = (response:any, apiName:any) => {
    const apiData = response.payload;
    if (apiData && apiData.success === false) {
        const errorMessage = apiData.message || `Error in ${apiName} API`;
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: errorMessage,
            textBody: response.payload.message,
            button: 'close',
        });
    }
};
