import axios from "axios"
import { editProductionApiPath, getAllSlipsWithShop, getAllWorkOrdersApiPath, getDailyLogsReportApiPath, getNegativeInventoryApiPath, getShopShiftTimingsReportApiPath, getSingleWorkOrderApiPath, getSlipsOneDetailApiPath, getWorkOrderByChildPartApiPath, getWorkOrderByChildPartByWorkOrderAPIPath, randomThoughts } from "../apiRoutes"
import { TrophyIcon } from "react-native-heroicons/solid";

export const getAllWorkOrder = async (option: any) => {
    const { selectedOption3, selectedOption1, selectedOption4 } = option
    try {
        const { data } = await axios.post(`${getAllWorkOrdersApiPath}`, { "sort": selectedOption1, "minInventory": selectedOption4 == 'true' ? true : false, "days": selectedOption3 }, {
            withCredentials: true
        })
        return data;
    } catch (error) {
        return error
    }
}


export const getSingleWorkOrder = async (id: string) => {
    try {
        const { data } = await axios.get(`${getSingleWorkOrderApiPath}/${id}`, {
            withCredentials: true
        })
        console.log("getSingleWork", data);
        return data
    } catch (error) {
        return error
    }
}

export const editProduction = async (id: string, val: any) => {
    try {
        console.log(id);
        console.log(val);
        const { data } = await axios.patch(`${editProductionApiPath}/${id}`, val, {
            withCredentials: true
        })
        console.log("getSingleWork", data);
        return data
    } catch (error) {
        return error
    }
}

export const getWorkOrderByChildPart = async (id: string) => {
    try {
        const { data } = await axios.get(`${getWorkOrderByChildPartApiPath}/${id}`, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        throw error
    }
}

export const getWorkOrderByChildPartByWorkOrder = async (val: any) => {
    try {
        const { data } = await axios.post(`${getWorkOrderByChildPartByWorkOrderAPIPath}`, val, {
            withCredentials: true,
        })
        console.log(data);
        return data
    } catch (error) {
        throw error
    }
}

export const getSlipsOneDetail = async (id: any) => {
    try {
        const { data } = await axios.get(`${getSlipsOneDetailApiPath}/${id}`, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        throw error
    }
}

export const getNegative = async (id: any) => {
    try {
        const { data } = await axios.post(`${getNegativeInventoryApiPath}`, { "jobProfileId": id }, {
            withCredentials: true,
        });
        return data;
    } catch (error) {
        throw error
    }
}

export const getLogsReport = async (details: any) => {
    const { id, date } = details;
    console.log(id, date);
    try {
        const { data } = await axios.get(`${getDailyLogsReportApiPath}/${id}?date=${date}`);
        return data;
    } catch (error) {
        throw error;
    }
}

/// shift timings

export const shiftTimingsAsync = async (details: any) => {
    try {
        const { data } = await axios.post(`${getShopShiftTimingsReportApiPath}`, details, {
            withCredentials: true,
        })
        return data;
    } catch (error) {
        throw error;
    }
}


export const getAllSlipsShops = async (details: any) => {
    try {
        const { data } = await axios.post(`${getAllSlipsWithShop}`, details, {
            withCredentials: true,
        })
        return data;
    } catch (error) {
        return error;
    }
}

export const getRandomThoughts = async () => {
    try {
        const { data } = await axios.get(`${randomThoughts}`);
        return data;
    } catch (error) {
        throw error;
    }
}