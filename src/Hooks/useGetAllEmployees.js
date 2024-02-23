import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAllMachine } from '../redux/API/machine';
import axios from 'axios';
import { getEmployeeApiPath } from '../redux/apiRoutes';
import { useDispatch } from 'react-redux';
import { getEmployeeAsync } from '../redux/Slice/machineSlice';

const useGetAllEmployees = () => {
    const dispatch = useDispatch()
    return useQuery('GetAllEmployees', () => dispatch(getEmployeeAsync()));
}

export default useGetAllEmployees

