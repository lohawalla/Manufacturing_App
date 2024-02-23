import axios from "axios"
import { createLogsApiPath, employeeProductivityApiPath, fetchProfilesApiPath, getAllLogsCNCApiPath, getAllProgramsApiPath, getAllWorkOrdersApiPath, getEmployeeApiPath, getMachineApiPath, getPunchesandPunchOutOfSingleEmployeeApiPath, getShopLogApiPath } from "../apiRoutes"

export const getAllMachine = async () => {
    try {
        const { data } = await axios.post(`${getMachineApiPath}`, {
            withCredentials: true
        })
        return data;
    } catch (error) {
        return error;
    }
}

export const getAllEmployees = async () => {
    try {
        const { data } = await axios.get(`${getEmployeeApiPath}`, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        return error
    }
}

// Get 
export const getAllCncLogs = async () => {
    try {
        const { data } = await axios.post(`${getAllLogsCNCApiPath}`, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        throw error
    }
}

// GET ALL PROGRAMS LOGS


export const getAllPrograms = async () => {
    try {
        const { data } = await axios.post(`${getAllProgramsApiPath}`, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        throw error
    }
}

export const createLogs = async (id: any, val: any) => {
    try {
        console.log(id, val)
        const { data } = await axios.post(`${createLogsApiPath}/${id}`, val, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        throw error
    }
}

export const fetchProfile = async () => {
    try {
        const { data } = await axios.get(`${fetchProfilesApiPath}`, {
            withCredentials: true,
        })
        return data
    } catch (error) {
        throw error
    }
}

export const singleEmployeeDetails = async (id: any) => {
    try {
        const { data } = await axios.get(`${getPunchesandPunchOutOfSingleEmployeeApiPath}/${id}`, { withCredentials: true })
        return data
    } catch (error) {
        throw error
    }
}

export const employeeProductivity = async (ids: any, Date: any) => {
    console.log(ids, Date)
    try {
        const { data } = await axios.post(`${employeeProductivityApiPath}`, { employeeIds: ids, newDate: Date }, { withCredentials: true })
        console.log(data)
        return data
    } catch (error) {
        throw error
    }
}

export const getShopLog = async () => {
    try {
        const { data } = await axios.get(`${getShopLogApiPath}`);
        return data
    } catch (error) {
        throw error;
    }
}