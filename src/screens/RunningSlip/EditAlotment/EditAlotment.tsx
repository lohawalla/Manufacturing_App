import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, FlatList, ScrollView, Modal as Modal1, BackHandler, ToastAndroid, Vibration } from 'react-native'
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import Feather from 'react-native-vector-icons/Feather';
import { ImageIndex } from '../../../assets/AssetIndex';
// import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { allotWorkAsync, autoSelectSlipAsync } from '../../../redux/Slice/productionSlice';
import { getEmployeeAsync } from '../../../redux/Slice/machineSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { ActivityIndicator } from 'react-native';
import store from '../../../redux/store';

const EditAlotment = ({ navigation }: any) => {
    const { t } = useTranslation();
    type AppDispatch = typeof store.dispatch;
    const dispatch = useDispatch<AppDispatch>();
    const [showModal, hideModal] = useState(false)//for machine
    const [showModal1, hideModal1] = useState(false)//for emp
    const [expanded, setExpanded] = useState(false); //active
    const [expanded1, setExpanded1] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);//for small modal remove
    const [isModalProductionLogVisible, setIsModalProductionLogVisible] = useState(false);
    const [produced, setProduced] = useState('');
    const [employ, setEmploy] = useState<any[]>([]);//counting last total employ
    const [machi, setMachi] = useState<any[]>([]);//counting last total machines
    const [params1, setParams1] = useState<any[]>([]);
    const [params2, setParams2] = useState<any[]>([]);
    const [MA_Name, setMA_NAME] = useState<any>([]);
    const [EM_Name, setEM_NAME] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const employeeData = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' },
        { id: 4, name: 'Alice Brown' },
        { id: 5, name: 'John Dose' },
        { id: 6, name: 'Jane Smsith' },
        { id: 7, name: 'Bob Johxnson' },
        { id: 8, name: 'Alice Bxvrown' },
        { id: 9, name: 'John Dvoe' },
        { id: 13, name: 'Jane Svmith' },
        { id: 23, name: 'Bob Jovhnson' },
        { id: 43, name: 'Alice vBrown' },
    ];
    const route = useRoute();
    const ScannedData = useSelector((state: any) => state.production.scannedSlips)
    const el = ScannedData.productionSlip;
    const ele = ScannedData.workOrder
    const ref = useRef<TextInput>(null);
    const fetchStorage = () => {
        AsyncStorage.getItem('editedEData')
            .then((data) => {
                if (data) {
                    const scannedEDataFromStorage = JSON.parse(data);
                    setEM_NAME(scannedEDataFromStorage)
                    console.log('scannedEData retrieved from AsyncStorage:', scannedEDataFromStorage);
                } else {
                    console.log('No scannedEData found in AsyncStorage');
                }
            })
            .catch((error) => {
                console.error('Error retrieving scannedEData from AsyncStorage:', error);
            });
    }
    const fetchMachineStorage = () => {
        AsyncStorage.getItem('editedMData')
            .then((data) => {
                if (data) {
                    const scannedEDataFromStorage = JSON.parse(data);
                    setMA_NAME(scannedEDataFromStorage)
                    console.log('scannedEData retrieved from AsyncStorage:', scannedEDataFromStorage);
                } else {
                    console.log('No scannedEData found in AsyncStorage');
                }
            })
            .catch((error) => {
                console.error('Error retrieving scannedEData from AsyncStorage:', error);
            });
    }
    const clearDataFromStorage = async (storageKey: any, setStateCallback: any) => {
        try {
            await AsyncStorage.removeItem(storageKey);
            setStateCallback([]);
        } catch (error) {
            console.error('Error clearing data from AsyncStorage:', error);
        }
    };
    const handleClearButtonClick = async () => {
        await clearDataFromStorage('editedEData', setParams1);
        await clearDataFromStorage('editedMData', setParams2);
        await clearDataFromStorage('scannedEditedEmployeesData', setParams2);
        await clearDataFromStorage('scannedEditedMachinesData', setParams2);
        await clearDataFromStorage('scannedEData', setEM_NAME);
        await clearDataFromStorage('scannedMData', setMA_NAME);
        await clearDataFromStorage('scannedEmployeesData', setMA_NAME);
        await clearDataFromStorage('scannedMachinesData', setMA_NAME);
    };
    useLayoutEffect(() => {
        fetchStorage();
        fetchMachineStorage()
    }, [route])
    const extractedIds = params1.map((item) => item.employee._id);
    const extractedNames = params1.map((item) => item.employee.name);
    const extractedMachineIds = params2.map(({ machine }) => machine._id);
    const extractedMachineNames = params2.map(({ machine }) => machine.machineName);
    console.log("=============================================================", extractedMachineNames);
    BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack();
        return true;
    });
    const [expanded3, setExpanded3] = useState(false)
    const [filteredEmployeeData, setFilteredEmployeeData] = useState(employeeData);
    const toggleHandle = () => {
        setExpanded(!expanded);
    }
    const toggleHandle1 = () => {
        setExpanded1(!expanded1);
    }
    const toggleHandle3 = () => {
        setExpanded3(!expanded3);
    }
    useEffect(() => {
        dispatch(autoSelectSlipAsync(el.productionSlipNumber))
        dispatch(getEmployeeAsync())
    }, [employ, machi])
    const autoSelect = useSelector((state: any) => state.production.autoSelectSlip)
    const remainQuantity = useSelector((state: any) => state.production.remainQuantity)
    console.log("====================================FFFFF=========================", remainQuantity);
    const employees = autoSelect.employees;
    const machines = autoSelect.machines;
    const [totalEmp, setTotalEmp] = useState<string[]>([])
    const [totalMac, setTotalMac] = useState<string[]>([])
    const [fromTime, setFromTime] = useState('');
    const [production, seProduction] = useState(el.numberOfItems - el.itemProduced)
    const [empl, setEmpl] = useState<any[]>([]);
    const [machine, setMachine] = useState<any[]>([]);
    const allEmployees = useSelector((state: any) => state.machine.allEmployees)
    const allMachines = useSelector((state: any) => state.machine.allMachines)
    const [sign, setSign] = useState('')
    useEffect(() => {
        setTotalEmp([employees]);
        setTotalMac([machines])
    }, [employees, machines, employ, machi]);
    const filteredEmployees = allEmployees?.filter((employee: any) => {
        return !employees?.some((filterEmployee: any) => {
            return filterEmployee?.employeeName === employee?.employeeName;
        });
    });
    const filteredMachines = allMachines?.filter((machine: any) => {
        return !machines?.some((filterMachine: any) => {
            return filterMachine?.machineName === machine?.machineName;
        });
    });
    useEffect(() => {
        const handleTimeChange = (selectedTime: any) => {
            if (selectedTime) {
                const hours = selectedTime.getHours() % 12 || 12;
                const minutes = selectedTime.getMinutes();
                const ampm = selectedTime.getHours() >= 12 ? 'PM' : 'AM';
                const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
                setFromTime(formattedTime)
                return formattedTime;
            } else {
                console.log("Object");
            }
        };
        console.log(typeof (handleTimeChange(new Date())));
    }, []);
    const handleEmployee = (sign: any) => {
        if (sign == "Remove") {
            const filteredTotal = totalEmp
                ? totalEmp.map((subArray: any) =>
                    subArray.filter((item: any) => !empl.includes(item.employeeId))
                )
                : [];
            const employeeIds = filteredTotal.flatMap(innerArray => innerArray.map((employeeObj: any) => employeeObj.employeeId));
            const machineIds = machines.map((machine: any) => machine.machineId);
            if (employeeIds.length > 0) {
                const editEmp = {
                    productionSlipNumber: el.productionSlipNumber,
                    employeeIds,
                    machineIds,
                    durationFrom: fromTime,
                    itemProduced: el.itemProduced
                }
                dispatch(allotWorkAsync(editEmp)).then((response: any) => {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "success",
                        textBody: "Employee Edited Successfully",
                    })
                    setModalVisible(false)
                    hideModal1(!showModal1)
                    setEmploy([...employ, ...employeeIds]);
                }).catch((error: any) => {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: "An error occurred. Log was not edited.",
                    });
                });
            } else {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Warning",
                    textBody: "Employees Could not be Empty",
                })
                setModalVisible(false)
                hideModal1(false)
            }
        } else if (sign == "Add") {
            const machineIds = machines.map((machine: any) => machine.machineId);
            const employeeIdsFromData1 = totalEmp.flat().map((employee: any) => employee.employeeId);
            const employeeIdFromData2: any = empl[0]?.employeeId;
            const employeeIds = [...employeeIdsFromData1, employeeIdFromData2]
            const addEmp = {
                productionSlipNumber: el.productionSlipNumber,
                employeeIds,
                machineIds,
                durationFrom: fromTime,
                itemProduced: el.itemProduced
            }
            try {
                dispatch(allotWorkAsync(addEmp)).then((response: any) => {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "success",
                        textBody: "Employee Added successfully",
                    })
                    setModalVisible(false)
                    hideModal1(!showModal1)
                    setEmploy([...employ, ...employeeIds]);
                }).catch((error: any) => {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: "An error occurred. Log was not edited.",
                    });
                });
            } catch (error) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Failed",
                    textBody: "Employee not successfully",
                })
                setModalVisible(false)
                hideModal1(!showModal1)
            }
        }
    }

    const handleMachine = (sign: any) => {
        if (sign == "Remove") {
            const filteredTotal = totalMac
                ? totalMac.map((subArray: any) =>
                    subArray.filter((item: any) => !machine.includes(item._id))
                )
                : [];
            const employeeIds = employees.map((employee: any) => employee.employeeId);
            const machineIds = filteredTotal.flatMap(innerArray => innerArray.map((employeeObj: any) => employeeObj.machineId));
            if (machineIds.length > 0) {
                const editMac = {
                    productionSlipNumber: el.productionSlipNumber,
                    employeeIds,
                    machineIds,
                    durationFrom: fromTime,
                    itemProduced: el.itemProduced
                }
                dispatch(allotWorkAsync(editMac)).then((response: any) => {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "success",
                        textBody: "Machine Removed Successfully",
                    })
                    setMachi([...machi, ...machineIds])
                    setModalVisible(false)
                    hideModal(!showModal)
                }).catch((error: any) => {
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: "An error occurred. Log was not edited.",
                    });
                });
            }
        } else if (sign == "Add") {
            const employeeIds = employees.map((employee: any) => employee.employeeId);
            const machineIdsFromData1 = totalMac.flat().map((machine: any) => machine.machineId);
            const machineIdFromData2: any = machine[0];
            const machineIds = [...machineIdsFromData1, machineIdFromData2]
            const addMac = {
                productionSlipNumber: el.productionSlipNumber,
                employeeIds,
                machineIds,
                durationFrom: fromTime,
                itemProduced: el.itemProduced
            }
            try {
                dispatch(allotWorkAsync(addMac)).then((response: any) => {
                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "success",
                        textBody: "Machine Added successfully",
                    })
                    setMachi([...machi, ...machineIds])
                    setModalVisible(false)
                    hideModal(!showModal)
                })
                    .catch((error: any) => {
                        Toast.show({
                            type: ALERT_TYPE.DANGER,
                            title: "Error",
                            textBody: "An error occurred. Log was not edited.",
                        });
                    });
            } catch (error) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Failed",
                    textBody: "Machine not successfully",
                })
                setModalVisible(false)
                hideModal(!showModal)
            }
        }
    }
    const extractedMachinePart2 = machines.map((machine: any) => machine.machineName);
    const extractedEmployeePart2 = employees.map((employee: any) => employee.employeeName);
    const newMachineArray = MA_Name.map((employee: any) => ({
        id: employee?.machine._id, 
        name: employee?.machine.machineName, 
    }));  
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<555555555<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", newMachineArray);
    const initialMachineCheckedState: any = {};
    newMachineArray.forEach((item: any) => {
        initialMachineCheckedState[`${item.id}_${item.name}`] = false;
    });
    const [checkedMachineItems, setCheckedMachineItems] = useState(initialMachineCheckedState);
    const toggleItemMachine = (id: any, name: any) => {
        setCheckedMachineItems((prevState: any) => ({
            ...prevState,
            [`${id}_${name}`]: !prevState[`${id}_${name}`],
        }));
    };
    const selectedMachinesNames2 = newMachineArray
        .filter((employee: any) => !checkedMachineItems[`${employee.id}_${employee.name}`])
        .map((employee: any) => employee.name);
    const selectedMachinesIDs2 = newMachineArray
        .filter((employee: any) => !checkedMachineItems[`${employee.id}_${employee.name}`])
        .map((employee: any) => employee.id);
    ////
    console.log("88088800888080080555555555555555588ssssssssssqqq", checkedMachineItems);
    console.log("88088800888080080555555555555555588ssssssssssqqq", selectedMachinesIDs2);
    //Employees   
    const newArray = EM_Name.map((employee: any) => {
        console.log(employee);
        return {
            id: employee.employee?._id,
            name: employee.employee?.name, 
            profilePic: (employee?.profilePicture) ? (employee?.profilePicture) : ('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
        };
    });
    const employeeArray = [...newArray];
    console.log(newArray);
    const initialCheckedState: any = {};
    employeeArray.forEach((item: any) => {
        initialCheckedState[item?.status] = true;
    });
    const [checkedItems, setCheckedItems] = useState(employeeArray);
    const toggleItem = (id: any, status: any) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id], 
        }));
    };
    const selectedEmployeeNames = employeeArray
        .filter((employee) => !checkedItems[employee.id])
        .map((employee) => employee.name);
    const selectedEmployeeIDs = employeeArray
        .filter((employee) => !checkedItems[employee.id])
        .map((employee) => employee.id);
    useEffect(() => {
        if (+produced > remainQuantity) {
            Vibration.vibrate(1000);
            ToastAndroid.show("You are exceeding log.(आप लॉग से अधिक हो रहे हैं)", ToastAndroid.SHORT)
        }
    }, [produced])
    const handleOKLog = () => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", fromTime)
        setIsModalProductionLogVisible(true)
        const employeeIds = employees.map((item: any) => item.employeeId)
        const machineIds = machines.map((item: any) => item.machineId)
        const edited = {
            productionSlipNumber: el.productionSlipNumber,
            employeeIds: selectedEmployeeIDs ? employeeIds.concat(selectedEmployeeIDs) : employeeIds,
            machineIds: selectedMachinesIDs2 ? machineIds.concat(selectedMachinesIDs2) : machineIds,
            durationFrom: fromTime,
            itemProduced: produced
        }
        setLoading(true)
        dispatch(allotWorkAsync(edited))
            .then((response: any) => {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: "Log Edited successfully",
                });
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Log Edited successfully",
                    button: 'close',
                })
                setIsModalProductionLogVisible(false);
                setLoading(false)
                handleClearButtonClick()
                navigation.navigate('dashboard');
            })
            .catch((error: any) => {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: "An error occurred. Log was not edited.",
                });
                setLoading(false)
                handleClearButtonClick();
            });
    }
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <View style={{ marginTop: 30, marginLeft: responsiveWidth(3) }}>
                <Text style={{ color: '#666666', fontWeight: '500' }}>{t('WORK ORDER')} # {ele?.orderNumber}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 21, fontWeight: '700', }}>{ele?.finishItemName}</Text>
                    <Text style={styles.TopText}>{ele?.orderQuantity} Items</Text>
                </View>
                <TouchableOpacity style={styles.BtnStyle} onPress={() => setIsModalProductionLogVisible(true)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name='edit' size={29} color={'white'} />
                        <Text style={styles.BTextStyle}>Edit Allotment (संपादन करे)</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View >
                <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
                    <Text style={styles.TopGap}>{t('Production Slip')}</Text>
                    <View style={{ width: '100%', height: '12%', backgroundColor: '#F0F0F0', marginTop: 6, borderRadius: 5, borderWidth: 0.3, borderColor: '#4A4A4A', justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontWeight: '500', fontSize: 18 }}>{el?.part?.partName}-{el?.process?.processName}</Text></View>
                    <Text style={styles.TopGap}>{t('Employees')}</Text>
                    <TouchableOpacity style={styles.InputText} onPress={() => hideModal1(!showModal1)}>
                        <Text style={{ color: "black", marginLeft: responsiveWidth(4) }}>{extractedEmployeePart2 ? extractedEmployeePart2.join(',') : ""} + {selectedEmployeeNames.length > 0 ? selectedEmployeeNames.join(',') : "जोड़ने के लिए स्कैन करें"}</Text>
                        <Feather
                            name={"search"}
                            size={20}
                            style={{ marginLeft: '90%', marginTop: 8, textAlign: 'center' }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.TopGap}>{t('Machines')}</Text>
                    <TouchableOpacity style={styles.InputText} onPress={() => hideModal(!showModal)} >
                        <Text style={{ color: "black", marginLeft: responsiveWidth(4) }}>{extractedMachinePart2 ? extractedMachinePart2.join(',') : ""} + {selectedMachinesNames2.length > 0 ? selectedMachinesNames2.join(',') : "जोड़ने के लिए स्कैन करें"}</Text>
                        <Feather
                            name={"search"}
                            size={20}
                            style={{ marginLeft: '90%', marginTop: 8, textAlign: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View >
                <Modal isVisible={showModal} animationInTiming={600} style={styles.modal} onBackdropPress={() => hideModal(false)}
                    onBackButtonPress={() => hideModal(false)} >
                    <View style={[styles.modalContainer, { height: '80%' }]}>
                        <View style={{ flexDirection: 'row', marginRight: '20%', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '100%', height: '50%', marginLeft: 10 }}  >
                                <Feather
                                    name={"search"}
                                    size={22}
                                    style={{ marginLeft: 10 }}
                                />
                            </TouchableOpacity>
                            <Feather
                                name={"camera"}
                                size={22}
                                style={{ marginLeft: '6%', marginTop: '5%', marginBottom: 10 }}
                                onPress={() => navigation.navigate('EditMachineCamera', { ele, el, params1, params2 })}
                            />
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#BDBFC5',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        <View style={{ flexDirection: 'column', margin: '8%' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={toggleHandle}>
                                <Text style={styles.modalText}>{t('ACTIVE MACHINES')}</Text>
                                <Feather
                                    name={expanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    style={{ marginLeft: '2%' }}
                                />
                            </TouchableOpacity>
                            <ScrollView style={{ overflow: 'scroll' }}>
                                <View style={{ maxHeight: responsiveHeight(55) }}>
                                    {expanded && (
                                        <FlatList
                                            data={machines}
                                            renderItem={({ item }: any) => (
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                                                    <Image
                                                        source={{ uri: "https://cdn.dribbble.com/users/1179255/screenshots/3869804/media/128901c4ce0bbbe670bfb35a6b204b93.png?resize=400x300&vertical=center" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />
                                                    <Text style={{ fontSize: 15, color: '#666666', marginTop: responsiveHeight(2) }}> {item.machineName.length > 20 // Adjust the character limit as needed
                                                        ? `${item.machineName.substring(0, 20)}...`
                                                        : item.machineName}</Text>
                                                    <Feather
                                                        name={"log-out"}
                                                        size={22}
                                                        color={'#8A2626'}
                                                        onPress={() => {
                                                            setMachine([item._id]);
                                                            setSign('Remove');
                                                            setModalVisible(true);
                                                        }}
                                                    />
                                                </View>
                                            )}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }} onPress={toggleHandle1}>
                                <Text style={styles.modalText}>{t('INACTIVE MACHINES')}</Text>
                                <Feather
                                    name={expanded1 ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    style={{ marginLeft: '2%' }}
                                />
                            </TouchableOpacity>
                            <ScrollView style={{ overflow: 'scroll' }}>
                                <View style={{ maxHeight: responsiveHeight(50) }}>
                                    {expanded1 && (
                                        <FlatList
                                            data={filteredMachines}
                                            renderItem={({ item }: any) => (
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                                                    <Image
                                                        source={{ uri: "https://cdn.dribbble.com/users/1179255/screenshots/3869804/media/128901c4ce0bbbe670bfb35a6b204b93.png?resize=400x300&vertical=center" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />
                                                    <Text style={{ fontSize: 15, color: '#666666', marginTop: responsiveHeight(2) }}> {item.machineName.length > 20 // Adjust the character limit as needed
                                                        ? `${item.machineName.substring(0, 20)}...`
                                                        : item.machineName}</Text>
                                                    <Feather
                                                        name={"plus"}
                                                        size={22}
                                                        color={'#283093'}
                                                        onPress={() => {
                                                            setMachine([item._id]);
                                                            setSign('Add');
                                                            setModalVisible(true);
                                                        }}
                                                    />
                                                </View>
                                            )}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                            <ScrollView>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}
                                    onPress={toggleHandle3}
                                >
                                    <Text style={styles.modalText}>{t('QR SCANNED MACHINE')}</Text>
                                    <Feather
                                        name={expanded3 ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        style={{ marginLeft: '2%' }}
                                    />
                                </TouchableOpacity>
                                {/* //for qr scann list  */}
                                <View style={{ maxHeight: responsiveHeight(40) }}>
                                    {expanded3 && (
                                        <FlatList
                                            data={newMachineArray}
                                            keyExtractor={(item) => `${item.id}_${item.name}`}
                                            renderItem={({ item }: any) => (
                                                console.log(item),
                                                (
                                                    <View
                                                        style={[
                                                            styles.card,
                                                            {
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                flex: 1,
                                                                alignItems: 'center',
                                                                // marginLeft: responsiveWidth(2.5),
                                                            },
                                                        ]}
                                                    >
                                                        <View>
                                                            <Text
                                                                style={{
                                                                    color: '#666666',
                                                                    fontWeight: '500',
                                                                    fontSize: 14,
                                                                    lineHeight: 16.94,
                                                                }}
                                                            >
                                                                {item.name}
                                                            </Text>
                                                        </View>
                                                        <View style={{}}>
                                                            <Checkbox.Android
                                                                status={
                                                                    checkedMachineItems[`${item.id}_${item.name}`]
                                                                        ? 'unchecked'
                                                                        : 'checked'
                                                                }
                                                                onPress={() => {
                                                                    toggleItemMachine(item.id, item.name);
                                                                }}
                                                            />
                                                        </View>
                                                    </View>
                                                )
                                            )}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                            <Modal1
                                // style={{ backgroundColor: 'red' }}
                                visible={isModalVisible}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={() => setModalVisible(false)} // Close the modal when pressing the hardware back button on Android
                            >
                                {/* <View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1, shadowOpacity: 2, shadowOffset: 9, shadowColor: 'gray' }}> */}
                                <View style={{ width: '80%', height: '20%', backgroundColor: 'white', marginTop: '90%', borderWidth: 0.2, elevation: 9, padding: '5%', marginLeft: '10%', marginRight: '5%' }}>
                                    <Text style={{ color: 'black', fontWeight: '700', fontSize: 20, marginBottom: 10 }}>Remove Machine</Text>
                                    <View>
                                        <Text>Do you want remove machinename</Text>
                                        <View style={{ flexDirection: 'row', marginTop: '4%' }}>
                                            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ borderWidth: 0.2, borderRadius: 2, backgroundColor: 'white', paddingHorizontal: 25, borderColor: '#949494', paddingVertical: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Feather name="x" size={24} color="#949494" />
                                                    <Text style={{ fontWeight: '500', color: '#949494', fontSize: 16 }}>Cancel</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleMachine(sign)} style={{ borderWidth: 0.2, borderRadius: 3, backgroundColor: '#8A2626', marginLeft: '4%', paddingHorizontal: 20, paddingVertical: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Feather name="check" size={24} color="white" />
                                                    <Text style={{ fontWeight: '500', color: 'white', fontSize: 16 }}>{sign}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal1>
                        </View>
                        {/* </ScrollView> */}
                    </View>
                </Modal>
                <Modal isVisible={showModal1} animationInTiming={600} style={styles.modal} onBackdropPress={() => hideModal1(false)}
                    onBackButtonPress={() => hideModal1(false)} >
                    <View style={[styles.modalContainer, { height: '80%' }]}>
                        <View style={{ flexDirection: 'row', marginRight: '20%', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '100%', height: '50%', marginLeft: 10 }}  >
                                <Feather
                                    name={"search"}
                                    size={22}
                                    style={{ marginLeft: 10 }}
                                />
                            </TouchableOpacity>
                            <Feather
                                name={"camera"}
                                size={22}
                                style={{ marginLeft: '6%', marginTop: '5%', marginBottom: 10 }}
                                onPress={() => navigation.navigate('EditEmployeeCamera', { ele, el })}
                            />
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#BDBFC5',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                            }}
                        />
                        {/* <ScrollView
                            nestedScrollEnabled
                            style={{ overflow: 'scroll' }}> */}
                        <View style={{ flexDirection: 'column', margin: '8%' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={toggleHandle}>
                                <Text style={styles.modalText}>{t('ACTIVE EMPLOYEES')}</Text>
                                <Feather
                                    name={expanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    style={{ marginLeft: '2%' }}
                                />
                            </TouchableOpacity>
                            <ScrollView style={{ overflow: 'scroll' }}>
                                <View style={{ maxHeight: responsiveHeight(55) }}>
                                    {expanded && (
                                        <FlatList
                                            data={employees}
                                            renderItem={({ item }: any) => (
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }}>
                                                    <Image
                                                        source={{ uri: "https://cdn-icons-png.flaticon.com/512/3789/3789820.png" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />
                                                    <Text style={{ fontSize: 15, color: '#666666', marginTop: responsiveHeight(2) }}>{item.employeeName.length > 20 // Adjust the character limit as needed
                                                        ? `${item.employeeName.substring(0, 20)}...`
                                                        : item.employeeName}</Text>
                                                    <Feather
                                                        name={"log-out"}
                                                        size={22}
                                                        color={'#8A2626'}
                                                        onPress={() => {
                                                            setEmpl([item.employeeId]);
                                                            setSign('Remove');
                                                            setModalVisible(true);
                                                        }}
                                                    />
                                                </View>
                                            )}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: '5%' }} onPress={toggleHandle1}>
                                <Text style={styles.modalText}>{t('INACTIVE EMPLOYEES')}</Text>
                                <Feather
                                    name={expanded1 ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    style={{ marginLeft: '2%' }}
                                />
                            </TouchableOpacity>
                            <ScrollView style={{ overflow: 'scroll' }}>
                                <View style={{ maxHeight: responsiveHeight(50) }}>
                                    {expanded1 && (
                                        <FlatList
                                            data={filteredEmployees}
                                            renderItem={({ item }: any) => (
                                                <View style={{ flexDirection: 'row', justifyContent: "space-between", padding: 10, alignItems: "center" }}>
                                                    <Image
                                                        source={{ uri: "https://cdn-icons-png.flaticon.com/512/3789/3789820.png" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />
                                                    <Text style={{ fontSize: 15, color: '#666666', marginTop: responsiveHeight(2) }}>{item.employeeName.length > 20 // Adjust the character limit as needed
                                                        ? `${item.employeeName.substring(0, 20)}...`
                                                        : item.employeeName}</Text>
                                                    <Feather
                                                        name={"plus"}
                                                        size={22}
                                                        color={'#283093'}
                                                        onPress={() => {
                                                            setEmpl([item]);
                                                            setSign("Add")
                                                            setModalVisible(true)
                                                        }}
                                                    />
                                                </View>
                                            )}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                            <ScrollView>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}
                                    onPress={toggleHandle3}
                                >
                                    <Text style={styles.modalText}>{t('QR SCANNED EMPLOYEES')}</Text>
                                    <Feather
                                        name={expanded3 ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        style={{ marginLeft: '2%' }}
                                    />
                                </TouchableOpacity>
                                {/* //for qr scann list  */}
                                <View style={{ maxHeight: responsiveHeight(40) }}>
                                    {expanded3 && (
                                        <FlatList
                                            data={employeeArray}
                                            renderItem={({ item }: any) => (
                                                console.log(item.profilePic),
                                                (
                                                    <View
                                                        style={[
                                                            styles.card,
                                                            {
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                flex: 1,
                                                                alignItems: 'center',
                                                                marginLeft: responsiveWidth(0.2),
                                                            },
                                                        ]}
                                                    >
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <View>
                                                                <Image
                                                                    source={{ uri: item.profilePic }}
                                                                    style={{
                                                                        width: responsiveHeight(8),
                                                                        height: responsiveHeight(8),
                                                                        borderRadius: responsiveHeight(10),
                                                                    }}
                                                                />
                                                            </View>
                                                            <View>
                                                                <Text
                                                                    style={{
                                                                        color: '#666666',
                                                                        fontWeight: '500',
                                                                        fontSize: 14,
                                                                        lineHeight: 16.94,
                                                                        marginLeft: 15
                                                                    }}
                                                                >
                                                                    {item.name.length > 15
                                                                        ? `${item.name.substring(0, 15)} ...`
                                                                        : item.name}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{}}>
                                                            <Checkbox.Android
                                                                status={
                                                                    checkedItems[item.id]
                                                                        ? 'unchecked'
                                                                        : 'checked'
                                                                }
                                                                onPress={() => {
                                                                    toggleItem(item.id, item.status);
                                                                }}
                                                            />
                                                        </View>
                                                    </View>
                                                )
                                            )}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                            <Modal1
                                // style={{ backgroundColor: 'red' }}
                                visible={isModalVisible}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={() => setModalVisible(false)} // Close the modal when pressing the hardware back button on Android
                            >
                                {/* <View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1, shadowOpacity: 2, shadowOffset: 9, shadowColor: 'gray' }}> */}
                                <View style={{ width: '80%', height: '20%', backgroundColor: 'white', marginTop: '90%', borderWidth: 0.2, elevation: 9, padding: '5%', marginLeft: '10%', marginRight: '5%' }}>
                                    <Text style={{ color: 'black', fontWeight: '700', fontSize: 20, marginBottom: 10 }}>{sign} Employee</Text>
                                    <View>
                                        <Text>Do You Want {sign} this Employee ?</Text>
                                        <View style={{ flexDirection: 'row', marginTop: '4%' }}>
                                            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ borderWidth: 0.2, borderRadius: 2, backgroundColor: 'white', paddingHorizontal: 25, borderColor: '#949494', paddingVertical: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Feather name="x" size={24} color="#949494" />
                                                    <Text style={{ fontWeight: '500', color: '#949494', fontSize: 16 }}>Cancel</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleEmployee(sign)} style={{ borderWidth: 0.2, borderRadius: 3, backgroundColor: '#8A2626', marginLeft: '4%', paddingHorizontal: 20, paddingVertical: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Feather name="check" size={24} color="white" />
                                                    <Text style={{ fontWeight: '500', color: 'white', fontSize: 16 }}>{sign}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal1>
                        </View>
                        {/* </ScrollView> */}
                    </View>
                </Modal>
            </View >
            <View>
                <Modal1
                    visible={isModalProductionLogVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsModalProductionLogVisible(false)}
                >
                    <View style={styles.modalContainer1}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{t('Log your production')}</Text>
                            <Text style={styles.label}>{t('Quantity Produced')}</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={produced}
                                    onChangeText={(ele) => setProduced(ele)}
                                    placeholder="Enter quantity"
                                    keyboardType="numeric"
                                />
                                <Text style={styles.remainingText}>
                                    / {remainQuantity}
                                </Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsModalProductionLogVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        (produced.length === 0 || +produced > remainQuantity) ? styles.disabledButton : styles.okButton,
                                    ]}
                                    onPress={() => handleOKLog()}
                                    disabled={produced.length === 0 || +produced > remainQuantity || loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.buttonText}>OK</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal1>
            </View>
        </View >
    )
}

export default EditAlotment

