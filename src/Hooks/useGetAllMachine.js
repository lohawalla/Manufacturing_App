import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAllMachine } from '../redux/API/machine';
import axios from 'axios';
import { getMachineApiPath } from '../redux/apiRoutes';


const fetchGetAllMachine = async () => {
    return await axios.post(`${getMachineApiPath}`, {
        withCredentials: true
    })

}

export const useGetAllMachine = () => {
    const queryClient = useQueryClient()
    return useQuery('GetAllMachine',fetchGetAllMachine);
};