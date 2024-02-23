import { LoginData } from "../Login/fetch/services/login";

export interface WorkOrder1 {
    _id: string;
    date: string;
    orderNumber: string;
    finishedItemId: string;
    finishItemName: string;
    partCode: string;
    MCode: string;
    orderQuantity: number;
    status: string;
    totalFinishItem: number;
    totalLoading: number;
    totalPlanning: number;
    negativeInventory: number;
    totalWorkOrderQuantity: number;
    totalProduction: number;
    slips?: number,
    id:number;
}
export interface authData {
    actions: {
        login: (d: any) => void;
        logout: () => void;
    },
    authData: LoginData
}

export type SearchData = number | string

export interface User {
    finishItemName: string;
    orderNumber:string | number;
    orderQuantity:string|number;
    totalFinishItem:number;
    date:string;
    totalWorkOrderQuantity:number;
    totalPlanning:number;
    totalProduction:number;
    negativeInventory:number;
    partCode:string;
    mCode:string;
    totalLoading:number;
    id:any;
}

export const fetchEtag = async () => {
    try {
        const response = await fetch('etagUrl');
        const etagValue = response.headers.get('ETag');
        return etagValue;
    } catch (error) {
        console.error('Error fetching ETag:', error);
        return null;
    }
};