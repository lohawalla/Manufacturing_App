import { BackHandler, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { empProductivityAsync, getEmployeeAsync, getPunchandPunchOut } from '../../redux/Slice/machineSlice';
import Navbar from '../../components/Navbar/Navbar';
import Accordion from '../../components/Accordian/Accordian';
import { useTranslation } from 'react-i18next';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { Checkbox } from 'react-native-paper';
import { styles } from './styles';
import { useGetAllEmployeesQuery } from '../../redux/features/apis2/Manufacturing';
import AnimatedLoader from '../../components/AnimatedLoader/AnimatedLoader';
import axios from 'axios';
const Employees = ({ navigation }: any) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [search1, setSearch1] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [expanded3, setExpanded3] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [modal, setModal] = useState<any>(false);
    const [search, setSearch] = useState('');
    const [info, setInfo] = useState([{}]) // Assuming info is an array of strings
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const { data: allEmployees, isError: employeeError, isSuccess: isEmployeeSuccess, refetch: employeeRefetch, isFetching: employeeFetching } = useGetAllEmployeesQuery({}, { refetchOnMountOrArgChange: true });
    useEffect(() => {
        const employeeArray = axios.get(`https://chawlacomponents.com/api/v1/productionSlip/getIdleActiveEmployees`)
        console.log(employeeArray);
    }, [])
    const filteredFalseMachines = (allEmployees?.employeeArray)?.filter((machine: any) => !machine.active) || []
    const filteredTrueMachines = (allEmployees?.employeeArray)?.filter((machine: any) => machine.active) || []
    const punchData = useSelector((state: any) => state.machine.singleEmployeeDetails)
    function convertTo12HourFormat(time: any) {
        const timePart = time.split('T')[1].split('.')[0]; // Extract time part
        const [hours, minutes, seconds] = timePart.split(':'); // Split the time
        let period = 'AM';
        let hour = parseInt(hours, 10);
        if (hour >= 12) {
            period = 'PM';
            if (hour > 12) {
                hour -= 12;
            }
        }
        return `${hour}:${minutes}:${seconds} ${period}`;
    }
    // console.log("heiiiii",filteredMachines);
    console.log("555556666666", filteredFalseMachines);
    console.log("555556666666", filteredTrueMachines);
    const searchData = (query: any) => {
        if (!query) {
            return filteredTrueMachines
        }
        query = query.toLowerCase();
        return filteredTrueMachines.filter((m: any) => {
            return m.employeeName.toLowerCase().includes(query);
        }
        )
    }
    const searchData1 = (query: any) => {
        if (!query) {
            return filteredFalseMachines
        }
        query = query.toLowerCase();
        return filteredFalseMachines.filter((m: any) => {
            return m.employeeName.toLowerCase().includes(query);
        }
        )
    }
    const searched1 = search1 ? searchData1(search1) : filteredFalseMachines;
    const searched = search ? searchData(search) : filteredTrueMachines;
    const empIds = filteredTrueMachines?.map((mac: any) => mac.employeeId)
    const empIDs2 = selectedItems?.map((item: any) => item.employeeId)
    const confirmIds = empIDs2.length != 0 ? [empIDs2, selectedItems] : [empIds, filteredTrueMachines]
    console.log(confirmIds);
    console.log(empIDs2);
    console.log(searched);
    const arr = confirmIds[0]
    useEffect(() => {
        dispatch(getEmployeeAsync())
        dispatch(empProductivityAsync({ arr, date }))
    }, [])
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        // Clean up the event listener when the component unmounts
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const closeModal2 = () => {
        setModal(false);
    };
    const handleBackButton = () => {
        // Prevent default behavior (going back)
        navigation.navigate("dashboard");
        return true;
    };
    const toggleHandle3 = () => {
        setExpanded3(!expanded3);
    }
    const handleActivePress = (item: any) => {
        setModal(true);
        console.log(item);
        dispatch(getPunchandPunchOut(item.employeeId)).then((res: any) => {
            console.log(res.payload.data.punches);
            console.log(item.employeeId);
            console.log(punchData[0].punches);
            console.log(punchData[0].punches[punchData[0].punches.length - 1]);
            const prod = item.productionSlip;
            const data = ({
                lastWorked: prod?.updatedAt,
                slipNumber: prod?.productionSlipNumber,
                lastPunchIn: punchData[0].punches[punchData[0].punches.length - 1]?.punchIn
                    ? convertTo12HourFormat(punchData[0].punches[punchData[0].punches.length - 1].punchIn)
                    : null,
                lastPunchOut: punchData[0].punches[punchData[0].punches.length - 1]?.punchOut
                    ? convertTo12HourFormat(punchData[0].punches[punchData[0].punches.length - 1].punchOut)
                    : "In the Production",
            });
            setInfo([data]);
        })
    };
    const handleItemPress = (item: any) => {
        // Toggle the selection state of the item
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem: any) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };
    const isItemSelected = (item: any) => selectedItems.includes(item);
    console.log("Akash chaurasiya", selectedItems);
    const toggleHandle2 = () => {
        setExpanded2(!expanded2);
    }
    const calculateTimeElapsed = (startTime: any) => {
        console.log(startTime)
        const currentTime: any = new Date();
        const startTimeDate: any = new Date(startTime);
        const timeDifference = Math.abs(currentTime - startTimeDate) / 1000;
        const days = Math.floor(timeDifference / 86400);
        const hours = Math.floor((timeDifference % 86400) / 3600);
        const minutes = Math.floor((timeDifference % 3600) / 60);
        const seconds = Math.floor(timeDifference % 60);
        const formattedTimeElapsed = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        return formattedTimeElapsed;
    };
    if (employeeFetching) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <View>
                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                    <View style={{ marginTop: 32, marginLeft: 20 }}>
                        <Text style={{ color: '#2E2E2E', fontWeight: '700', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter' }}>{t('Employees')}</Text>
                    </View>
                    <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Productivity', { confirmIds })}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Productivity Report</Text>
                        {selectedItems.length > 0 && (
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>{selectedItems.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: '10%' }}>
                    <View>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}
                            onPress={toggleHandle3}
                        >
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter' }}>{t('ACTIVE EMPLOYEES')}</Text>
                            <Feather
                                name={expanded3 ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                style={{ marginLeft: '2%' }}
                            />
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter', marginLeft: '12%' }}>{filteredTrueMachines.length}</Text>
                        </TouchableOpacity>
                        <View style={{ maxHeight: responsiveHeight(50) }}>
                            {expanded3 && (
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        borderRadius: 5,
                                        padding: 10,
                                        marginBottom: 10,
                                        width: "90%"
                                    }}
                                    placeholder="Search..."
                                    value={search}
                                    onChangeText={(item) => setSearch(item)}
                                />
                            )}
                            {expanded3 && (
                                <FlatList
                                    data={searched}
                                    renderItem={({ item, index }: any) => (
                                        console.log(item),
                                        (
                                            <TouchableOpacity
                                                style={[
                                                    styles.card,
                                                    {
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        // marginLeft: responsiveWidth(2.5),
                                                        backgroundColor: isItemSelected(item) ? 'lightblue' : 'transparent'
                                                    },
                                                ]}
                                                key={index}
                                                onLongPress={() => handleItemPress(item)}
                                            >
                                                <View>
                                                    {item.profilePicture ? (<Image
                                                        source={{ uri: item.profilePicture }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />) : (<Image
                                                        source={{ uri: "https://cdn.dribbble.com/users/1179255/screenshots/3869804/media/128901c4ce0bbbe670bfb35a6b204b93.png?resize=400x300&vertical=center" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />)}
                                                </View>
                                                <View>
                                                    <Text
                                                        ellipsizeMode='tail'
                                                        style={{
                                                            color: '#666666',
                                                            fontWeight: '500',
                                                            fontSize: 14,
                                                            lineHeight: 16.94,
                                                            marginLeft: responsiveWidth(3.5)
                                                        }}
                                                    >
                                                        {item.employeeName.length > 15 ? item.employeeName.substring(0, 15) + ' ...' : item.employeeName}
                                                    </Text>
                                                </View>
                                                <View >
                                                    <Checkbox.Android
                                                        status={isItemSelected(item) ? 'checked' : 'unchecked'}
                                                        onPress={() => handleItemPress(item)}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    )}
                                />
                            )}
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}
                            onPress={toggleHandle2}
                        >
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter' }}>{t('INACTIVE EMPLOYEES')}</Text>
                            <Feather
                                name={expanded2 ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                style={{ marginLeft: '2%' }}
                            />
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter', marginLeft: '10%' }}>{filteredFalseMachines.length}</Text>
                        </TouchableOpacity>
                        <View style={{ maxHeight: responsiveHeight(50) }}>
                            {expanded2 && (
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        borderRadius: 5,
                                        padding: 10,
                                        marginBottom: 10,
                                        width: "90%"
                                    }}
                                    placeholder="Search..."
                                    value={search1}
                                    onChangeText={(item) => setSearch1(item)}
                                />
                            )}
                            {expanded2 && (
                                <FlatList
                                    data={searched1}
                                    renderItem={({ item, index }: any) => (
                                        console.log(item),
                                        (
                                            <TouchableOpacity
                                                style={[
                                                    styles.card,
                                                    {
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        // marginLeft: responsiveWidth(2.5),
                                                    },
                                                ]}
                                                key={index}
                                                onPress={() => handleActivePress(item)}
                                            >
                                                <View>
                                                    {item.profilePicture ? (<Image
                                                        source={{ uri: item.profilePicture }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />) : (<Image
                                                        source={{ uri: "https://cdn.dribbble.com/users/1179255/screenshots/3869804/media/128901c4ce0bbbe670bfb35a6b204b93.png?resize=400x300&vertical=center" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />)}
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            color: '#666666',
                                                            fontWeight: '500',
                                                            fontSize: 14,
                                                            lineHeight: 16.94,
                                                            marginLeft: responsiveWidth(3.5)
                                                        }}
                                                    >
                                                        {item.employeeName}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    )}
                                />
                            )}
                        </View>
                    </View>
                    <Modal
                        visible={modal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={closeModal2}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' }}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Activated History</Text>
                                <FlatList
                                    data={info}
                                    renderItem={({ item, index }: any) => (
                                        <View key={index} >
                                            <View style={styles.itemContainer}>
                                                <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>Last Updated: </Text>
                                                <Text style={{ fontSize: 16, color: '#333' }}>{item.lastWorked ? calculateTimeElapsed(item.lastWorked) : "Not Alloted From Starting"}</Text>
                                            </View>
                                            <View style={styles.itemContainer}>
                                                <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>Last Worked On: </Text>
                                                <Text style={{ fontSize: 16, color: '#333' }}>{item.slipNumber ? item?.slipNumber : "Not Alloted from Starting"}</Text>
                                            </View>
                                            <View style={styles.itemContainer}>
                                                <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>Last Punch-In: </Text>
                                                <Text style={{ fontSize: 16, color: '#333' }}>{item.slipNumber ? item?.lastPunchIn : "Not Alloted from Starting"}</Text>
                                            </View>
                                            <View style={styles.itemContainer}>
                                                <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>Last Punch-Out: </Text>
                                                <Text style={{ fontSize: 16, color: '#333' }}>{item.slipNumber ? item?.lastPunchOut : "Not Alloted from Starting"}</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                                <TouchableOpacity onPress={closeModal2} style={{ alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    )
}
export default Employees
