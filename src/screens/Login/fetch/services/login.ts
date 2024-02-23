import AxiosFactory from "../../../../axios/AxiosFactory";
import apiIndex from "../apis";
import BaseInstance from "../instance";

export interface LoginCredentials {
    email?: string;
    password: string;
    phone?: number;
}
interface UpdateBy {
    by: string;
    name: string;
}

interface JobProfileId {
    _id: string;
    jobProfileName: string;
    parentJobProfileId: string;
    jobDescription: string;
    childProfileId: string[];
    employmentType: string;
    newFields: any[]; // Specify the type if possible
    createdAt: string;
    updatedAt: string;
    __v: number;
    department: string;
    isSupervisor: boolean;
}

interface User {
    updateBy: UpdateBy;
    _id: string;
    name: string;
    groupId: string;
    jobProfileId: JobProfileId;
    role: string;
    employeeCode: string;
    email: string;
    contactNumber: number;
    verified: boolean;
    password: string;
    lunchTime: number;
    salary: number;
    leaveTaken: number;
    currentBarCode: string;
    workingDays: number;
    workingHours: number;
    overTime: boolean;
    overTimeRate: number;
    trainingStatus: string;
    marks: any[]; // Specify the type if possible
    createdAt: string;
    updatedAt: string;
    __v: number;
    assignedBy: string;
    permanentBarCode: string;
    permanentBarCodeNumber: string;
    permanentQrCodeAssign: string;
    BarCodeStatus: boolean;
    active: boolean;
    productionLogs: any[]; // Specify the type if possible
    gender: string;
    optionForRole: string[];
    // Add any other properties as needed
}

interface Data {
    success: boolean;
    profilePicture: string;
    user: User;
    message: string;
    cookie: string;
}
enum RoleIndex {
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE",
    UNKNOWN = "UNKNOWN"
}

export interface LoginData {
    loginData: {
        success: boolean;
        userId: string;
        role?: RoleIndex;
        name: string;
        email?: string;
        phone?: number;
    }
}

export default async function login(data:LoginCredentials){
    const res=AxiosFactory.createInstance().post(apiIndex.login, data);
    console.log("Total",res);
    return res;
}