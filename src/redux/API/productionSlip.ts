import axios from "axios";
import { allotWorkApiPath, autoSelectApiPath, findEmployeeByQrApiPath, findMachineByQrApiPath, generateProductionApiPath, getCurrentActiveSlips, getCurrentLogsApiPath, getEmployeeSuggestionsApiPath, getMachineApiPath, getMachineSuggestionsApiPath, getRemainingQuantityApiPath, scanProductionSlipApiPath } from "../apiRoutes";

export const generateProductionSlip = async (val: any) => {
    console.log("959805899", val);
    try {
        const { data } = await axios.post(`${generateProductionApiPath}`, val, {
            withCredentials: true
        });
        return data;
    } catch (error) {
        return error;
    }
}

export const getCurrentSlips = async (id: any, status: any) => {
    try {
        const { data } = await axios.get(`${getCurrentActiveSlips}?workOrderId=${id}&status=${status}`, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        return error;
    }
}

export const getTotalSlips = async (selected: any) => {
    console.log(selected)
    if (selected != undefined) {
        try {
            const { data } = await axios.get(`${getCurrentActiveSlips}?date=${selected}`, {
                withCredentials: true,
            })
            return data
        } catch (error) {
            return error;
        }
    } else {
        try {
            const { data } = await axios.get(`${getCurrentActiveSlips}`, {
                withCredentials: true,
            })
            return data
        } catch (error) {
            return error;
        }
    }
}

export const scanProductionSlips = async (slipNumber: any) => {
    console.log('i am here', slipNumber);
    try {
        const response = await axios.get(`${scanProductionSlipApiPath}/${slipNumber}`, {
            withCredentials: true,
        });
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('text/html')) {
            throw new Error('Invalid response');
        }
        return response.data;
    } catch (error) {
        console.log('error', error);
        throw error;
    }
};


export const getSuggestedMachines = async (slipNumber: any) => {
    console.log("123321115515", slipNumber);
    try {
        const { data } = await axios.get(`${getMachineSuggestionsApiPath}/${slipNumber}`, {
            withCredentials: true,
        });
        console.log("suggested machines", data);
        return data
    } catch (error) {
        return error
    }
}


export const getSuggestedEmployees = async (slipNumber: any) => {
    console.log("123321115515", slipNumber);
    try {
        const { data } = await axios.get(`${getEmployeeSuggestionsApiPath}/${slipNumber}`, {
            withCredentials: true,
        });
        console.log("suggested Employees", data);
        return data
    } catch (error) {
        return error
    }
}


export const allotWorks = async (val: any) => {
    console.log("suggested Employees", val)
    try {
        const { data } = await axios.post(
            allotWorkApiPath,
            val,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            }
        );
        return data;
    } catch (error) {
        return error;
    }
};



export const findEmployee = async (data: any) => {
    try {
        const ele = await axios.post(`${findEmployeeByQrApiPath}`, { data }, {
            withCredentials: true
        });
        console.log("5555555555556666666665", ele.data);
        return ele.data;
    } catch (error) {
        return error
    }
}


export const findMachine = async (data: any) => {
    console.log("from production slip", data);
    try {
        const ele = await axios.post(`${findMachineByQrApiPath}`, { data }, {
            withCredentials: true
        });
        return ele.data;
    } catch (error) {
        return error
    }
}


export const autoSelectSlip = async (slipNumber: any) => {
    console.log("123321115515", slipNumber);
    try {
        const { data } = await axios.get(`${autoSelectApiPath}/${slipNumber}`, {
            withCredentials: true,
        });
        console.log("suggested machines", data);
        return data
    } catch (error) {
        return error
    }
}

export const getCurrentLogs = async (dataitem: any) => {
    try {
        console.log("ID-----------from prduction apiiiiiiiiiiiiiiiiiiiii", dataitem)
        const { data } = await axios.post(`${getCurrentLogsApiPath}/${dataitem.id}`, { "process": dataitem.selectedOption, "minInventory": dataitem.selectedOption4 == 'true' ? true : false, "days": dataitem.selectedOption3 }, {
            withCredentials: true,
        })
        console.log("checkdat fom apiiii-----------> 15.41", data)
        return data
    }
    catch (error) {
        return error;
    }
}

export const remainQuantity = async (d: any) => {
    try {
        const { data } = await axios.get(`${getRemainingQuantityApiPath}${d}`, {
            withCredentials: true,
        })
        return data;
    } catch (error) {
        throw error;
    }
}
