import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, RefreshControl } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProgramsAsync, getCncLogsAsync } from '../../redux/Slice/machineSlice';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
// @ts-ignore
import { Color, FontFamily, Padding } from '../Dashboard/GlobalStyles';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import AnimatedLoader from '../../components/AnimatedLoader/AnimatedLoader';
import { styles } from './styles';
import store from '../../redux/store';
const handleApiResponse = (response: any, apiName: any) => {
    const apiData = response.payload;
    if (apiData && apiData.success == false) {
        const errorMessage = apiData.message || `Error in ${apiName} API`;
        Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: errorMessage,
            textBody: response.payload.message,
            button: 'close',
        })
    }
}
const Program = ({ navigation }: any) => {
    const [isModalProductionLogVisible, setIsModalProductionLogVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [text, setText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    type AppDispatch = typeof store.dispatch;
    const dispatch = useDispatch<AppDispatch>();
    const fetchData = async () => {
        setLoading(true);
        try {
            const cncLogsResponse = await dispatch(getCncLogsAsync());
            handleApiResponse(cncLogsResponse, 'CNC');
            const allProgramsResponse = await dispatch(getAllProgramsAsync());
            handleApiResponse(allProgramsResponse, 'Programs');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [])
    const onRefresh = () => {
        setRefreshing(true);
        try {
            const CncLogs = dispatch(getCncLogsAsync())
            handleApiResponse(CncLogs, "CNC")
            setLoading(false);
            const allPrograms = dispatch(getAllProgramsAsync())
            handleApiResponse(allPrograms, "Programs")
            setRefreshing(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setRefreshing(false);
        }
    }
    const logs = useSelector((state: any) => state.machine.cncLogs)
    const programs = useSelector((state: any) => state.machine.programs)
    console.log(programs);
    const filteredData = programs
    console.log(filteredData);
    // filteredData.map((item:any) => ({
    //     name:item.programName,
    //     programNumber:item.program.programNumber
    // }))
    const searchData = (searchQuery: any) => {
        if (!searchQuery) {
            return filteredData;
        }
        searchQuery = searchQuery.toLowerCase();
        const filteredList = filteredData.filter((item: any) => {
            const part = (item.CNCProgramName || '').toString().toLowerCase();
            const workOrder = (item.planningNumber || '').toString().toLowerCase();
            const workOrderNumbers = item.childParts.map((ele: any) => ele.workOrderNumber);
            return part.includes(searchQuery) || workOrder.includes(searchQuery) || workOrderNumbers.includes(searchQuery);
        });
        if (filteredList.length === 0) {
            return [];
        }
        return filteredList;
    };
    const hoursFilter = (date: any) => {
        const dateTime = new Date(date);
        if (dateTime) {
            const date = dateTime.toDateString();
            const hours = dateTime.getHours() % 12 || 12;
            const minutes = dateTime.getMinutes();
            const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${date}  ${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            return formattedTime
        }
    }
    const flatListData = logs.map((log: any) => ({
        date: hoursFilter(log.date),
        process: log.processName,
        programName: log.programName,
        machine: log.machines.map((mac: any) => mac.machineName),
        sheetNumber: log?.numberOfSheet || '',
        totalTime: (log?.totalTime) || '',
        cycleTime: (log?.currentCycleTime) || '',
        cycleAssumed: log.cycleTimeAsProgram || '',
        loss: (log.totalLoss)
    }))
    console.log(selectedOption)
    const handleOkPressed = (CNCProgramName: any) => {
        console.log(selectedOption)
        setSelectedOption(CNCProgramName)
        const displace = filteredData.filter((ele: any) => ele._id === selectedOption);
        console.log(displace);
        if (displace.length > 0) {
            navigation.navigate("SingleProgramLogs", { displace })
        }
        setIsModalProductionLogVisible(false)
    }
    if (loading) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />
            <View style={{ padding: 15, flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                    <View style={styles.searchBarContainer}>
                        <Feather
                            name="search"
                            size={18}
                            color={'black'}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by Process/Component..."
                            onChangeText={text => setSearchQuery(text)}
                            value={searchQuery}
                            placeholderTextColor="gray"
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'column', marginTop: '5%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10%' }}>
                        <View >
                            <Text style={{ fontSize: 20, color: '#2E2E2E', fontWeight: '700' }}>Planning Logs</Text>
                        </View>
                    </View>
                    <View style={{ height: '85%' }}>
                        <FlatList
                            data={searchQuery.length > 0 ? searchData(searchQuery) : filteredData}
                            refreshControl={<RefreshControl
                                refreshing={refreshing} onRefresh={onRefresh}
                            />}
                            renderItem={({ item, index }) => (
                                console.log(item),
                                <TouchableOpacity style={{ borderWidth: 1, borderColor: 'white', borderRadius: 8, marginBottom: responsiveHeight(2), justifyContent: 'center', alignItems: 'center', }} onPress={() => navigation.navigate("SingleProgramLogs", { displace: [item] })}>
                                    <View style={{ backgroundColor: '#F5F5F5', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', flexDirection: 'row', padding: 20, justifyContent: 'space-between', width: '100%' }}>
                                        <View style={{ backgroundColor: '#F5F5F5', width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', flexDirection: 'row', padding: 10, justifyContent: 'space-around' }}>
                                            <View style={{ flexDirection: 'column', }}>
                                                <View style={{ flexDirection: 'column', gap: 10, justifyContent: 'flex-start' }}>
                                                    <Text style={{ color: 'black', fontWeight: '600', fontSize: 20, marginLeft: -15, marginTop: -20 }}>
                                                        {item.CNCProgramName.length > 25
                                                            ? `${item.CNCProgramName.substring(0, 25)}...`
                                                            : item.CNCProgramName}
                                                    </Text>
                                                </View>
                                                <View style={{ marginTop: 10 }}>
                                                    <View>
                                                        <View style={{ flexDirection: 'row', margin: 1 }}>
                                                            <Feather
                                                                name={"arrow-right-circle"}
                                                                size={15}
                                                                color={'black'}
                                                                style={{ marginRight: 5, color: "#283093" }}
                                                            />
                                                            <Text style={[styles.text22, styles.textTypo, styles.blueText, styles.new]}> Sheet Quantity Planned: </Text>
                                                            <Text style={[styles.text, styles.textTypo, styles.new]}>
                                                                {item.sheetPending}/{item.sheetQuantityPlanned}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <View style={{ flexDirection: 'row', margin: 1 }}>
                                                            <Feather
                                                                name={"arrow-right-circle"}
                                                                size={15}
                                                                color={'black'}
                                                                style={{ marginRight: 5, color: "#283093" }}
                                                            />
                                                            <Text style={[styles.text22, styles.textTypo, styles.blueText, styles.new]}> WorkOrder Number: </Text>
                                                            <Text style={[styles.text, styles.textTypo, styles.new]}>
                                                                <TouchableOpacity onPress={() => setShow(!show)}>
                                                                    <Feather
                                                                        name={"chevron-down"}
                                                                        size={25}
                                                                        style={{ marginRight: 5, color: "#283093" }}
                                                                    />
                                                                </TouchableOpacity>
                                                                {show && (item.childParts.map((ele: any) => ele.workOrderNumber).join('\n'))}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <View style={{ flexDirection: 'row', margin: 1 }}>
                                                            <Feather
                                                                name={"arrow-right-circle"}
                                                                size={15}
                                                                color={'black'}
                                                                style={{ marginRight: 5, color: "#283093" }}
                                                            />
                                                            <Text style={[styles.text22, styles.textTypo, styles.blueText, styles.new]}> ChildPart: </Text>
                                                            <Text style={[styles.text, styles.textTypo, styles.new]}>
                                                                <TouchableOpacity onPress={() => setShow1(!show1)}>
                                                                    <Feather
                                                                        name={"chevron-down"}
                                                                        size={25}
                                                                        style={{ marginRight: 5, color: "#283093" }}
                                                                    />
                                                                </TouchableOpacity>
                                                                {show1 && (item.childParts.map((ele: any) => ele.childPart.childPartName).join('\n'))}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        <TouchableOpacity style={{ flexDirection: 'row', margin: 1, borderWidth: 1, borderRadius: 10, backgroundColor: '#283093', width: '52%', paddingVertical: 12 }} onPress={() => navigation.navigate('DailyLogs', { "id": item._id, "name": item.CNCProgramName })}>
                                                            <Feather
                                                                name={"arrow-right-circle"}
                                                                size={15}
                                                                color={'white'}
                                                                style={{ marginRight: 5, color: "white" }}
                                                            />
                                                            <Text style={[{ color: 'white', alignSelf: 'center' }, styles.new]}>Daily-Report</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: '#ECEDFE', padding: 16, flexDirection: 'row', justifyContent: 'space-between', elevation: 2, borderRadius: 8, width: '100%' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 16, color: '#283093' }}>{item.createdAt.split("T")[0]}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}
export default Program