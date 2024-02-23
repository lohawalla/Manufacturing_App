import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ScrollView, RefreshControl, Alert, Vibration } from 'react-native'
import { Modal as MyCustomModal } from 'react-native';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allotWorkAsync, autoSelectSlipAsync, scanProductionSlipAsync, suggestedMachinesAsync } from '../../redux/Slice/productionSlice';
import Navbar from '../../components/Navbar/Navbar';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { Checkbox } from 'react-native-paper'; // Import RadioButton from react-native-paper
import SearchBar from 'react-native-search-bar';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { getMachinesAsync } from '../../redux/Slice/machineSlice';
import { Image } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import store from '../../redux/store';
const ScannedSlip = ({ navigation }: any) => {
    const { t } = useTranslation();
    type AppDispatch = typeof store.dispatch;
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute();
    const data: any = route.params;
    const [num, setNum] = useState(null)
    const [searchQuery, setSearchQuery] = React.useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showModal, hideModal] = useState(false)
    const [showModal1, hideModal1] = useState(false)
    const [expanded, setExpanded] = useState(false); //FOR QR SCANNED EMP
    const [expanded1, setExpanded1] = useState(false); //FOR REMAINING EMP
    const [query, setQuery] = useState('');
    const [eQuery, setEquery] = useState('');
    const toggleHandle = () => {
        setExpanded(!expanded);
    };
    const toggleHandle1 = () => {
        setExpanded1(!expanded1);
    };
    const onRefresh = () => {
        setRefreshing(true);
        fetchStorage();
        setRefreshing(false);
    };
    useEffect(() => {
        dispatch(getMachinesAsync())
    }, [])
    const ScannedData = useSelector((state: any) => state.production.scannedSlips)
    const SuggestedMachines = useSelector((state: any) => state.production.suggestedMachines)
    const SuggestedEmployees = useSelector((state: any) => state.production.suggestedEmployees)
    console.log("2451165433", (ScannedData?.productionSlip?.productionSlipNumber));
    const machines = SuggestedMachines?.machines;
    const suggestion = SuggestedEmployees
        ? SuggestedEmployees
            .map((employee: any) => ({
                id: employee.employeeId,
                name: employee.employeeName,
                profilePic: employee.profilePic ? employee.profilePic : "",
            }))
            .filter((employee: any, index: any, self: any) =>
                index === self.findIndex((e: any) => e.name === employee.name)
            )
        : [];
    const employees = (suggestion) ? (suggestion) : [];
    console.log(machines);
    console.log(suggestion);
    const el = ScannedData.productionSlip;
    const ele = ScannedData.workOrder
    console.log(ele, el)
    useEffect(() => {
        if (
            ScannedData &&
            ScannedData.productionSlip &&
            Array.isArray(ScannedData.productionSlip.working) &&
            ScannedData.productionSlip.working.length > 0 &&
            ScannedData.productionSlip.status !== "completed"
        ) {
            navigation.navigate("RunningSlip", { ele, el });
        } else if (
            ScannedData &&
            ScannedData.productionSlip &&
            ScannedData.productionSlip.status === "completed"
        ) {
            navigation.navigate("dashboard");
            Alert.alert('Slip Already Completed!! (पर्ची पहले ही पूरी हो चुकी है!!)');
        }
    }, [route]);
    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
    };
    const [fromTime, setFromTime] = useState('');
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [selectedNameItems, setSelectedNameItems] = useState<any>([]);
    const [selectedItems1, setSelectedItems1] = useState<any>([]);
    const [selectedNamesItems1, setSelectedNamesItems1] = useState<any>([]);
    const [selectedEmployessNamesItems1, setSelectedEmployessNamesItems1] = useState<any>([]);
    const [selectedMachineNamesItems1, setSelectedMachineNamesItems1] = useState<any>([]);
    const [EM_Name, setEM_NAME] = useState<any>([]);
    const [MA_Name, setMA_NAME] = useState<any>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [toTime, setToTime] = useState('');
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [filteredEmployeeData, setFilteredEmployeeData] = useState(machines);
    const [filteredMachineData, setFilteredMachineeData] = useState((employees) ? employees : [{}]);
    useEffect(() => {
        dispatch(autoSelectSlipAsync(el?.productionSlipNumber))
    }, [])
    const handleTimeChange = (selectedTime: any) => {
        if (selectedTime) {
            const hours = selectedTime.getHours() % 12 || 12;
            const minutes = selectedTime.getMinutes();
            const ampm = selectedTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            setFromTime(formattedTime);
        }
    };
    const handleMachineSearch = () => {
        hideModal(!showModal)
        console.log("weeeeeeeeeee", selectedItems);
    }
    const handleEmployeeSearch1 = () => {
        hideModal1(!showModal1)
    }
    const handleSelect = (id: number, name: string) => {
        setSelectedItems((prevSelectedItems: number[]) => {
            // Check if 'id' is already in 'selectedItems'
            const isSelected = prevSelectedItems.includes(id);
            // If 'id' is already selected, remove it
            if (isSelected) {
                return prevSelectedItems.filter((item) => item !== id);
            }
            // If 'id' is not selected, add it
            return [...prevSelectedItems, id];
        });
        setSelectedNameItems((prevSelectedNameItems: number[]) => {
            // Check if 'id' is already in 'selectedItems'
            console.log("55556666444", prevSelectedNameItems);
            const isSelected = prevSelectedNameItems.includes(id);
            // If 'id' is already selected, remove it
            if (isSelected) {
                return prevSelectedNameItems.filter((item) => item !== id);
            }
            // If 'id' is not selected, add it
            return [...prevSelectedNameItems, id];
        });
        setSelectedMachineNamesItems1((prevSelectedEmployeeItems: any[]) => {
            const isSelected = prevSelectedEmployeeItems.includes(id);
            if (isSelected) {
                return prevSelectedEmployeeItems.filter((item) => item.id !== id);
            }
            return [...prevSelectedEmployeeItems, name];
        });
    };
    const handleSelect1 = (id: number, name: string) => {
        console.log(id, name);
        setSelectedItems1((prevSelectedItems: number[]) => {
            // Check if 'id' is already in 'selectedItems'
            const isSelected = prevSelectedItems.includes(id);
            // If 'id' is already selected, remove it
            if (isSelected) {
                return prevSelectedItems.filter((item) => item !== id);
            }
            // If 'id' is not selected, add it
            return [...prevSelectedItems, id];
        });
        setSelectedNamesItems1((prevSelectedNameItems: number[]) => {
            // Check if 'id' is already in 'selectedItems'
            console.log("spacing888888888888222222222222", prevSelectedNameItems);
            const isSelected = prevSelectedNameItems.includes(id);
            // If 'id' is already selected, remove it
            if (isSelected) {
                return prevSelectedNameItems.filter((item) => item !== id);
            }
            // If 'id' is not selected, add it
            return [...prevSelectedNameItems, id];
        });
        setSelectedEmployessNamesItems1((prevSelectedEmployeeItems: any[]) => {
            const isSelected = prevSelectedEmployeeItems.includes(id);

            if (isSelected) {
                return prevSelectedEmployeeItems.filter((item) => item.id !== id);
            }
            return [...prevSelectedEmployeeItems, name];
        });
    };
    const handleEmployeeSearch = (query: string) => {
        if (!query) {
            return (filteredEmployeeData); // Reset to initial data
        }
        const filteredData = filteredEmployeeData?.filter((item: any) =>
            item.machineName.toLowerCase().includes(query.toLowerCase())
        );
        // Update the filtered data state
        return (filteredData || []);
    };

    const handleEmployeeSearch11 = (query: string) => {
        if (!query) {
            return suggestion
        }
        query = query.toLowerCase();
        // Filter the employeeData based on the search query
        const filteredData = suggestion?.filter((item: any) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        // Update the filtered data state
        return filteredData
    };
    useEffect(() => {
        handleEmployeeSearch(query);
        handleEmployeeSearch11(eQuery);
    }, [query, eQuery]);
    const Button = ({ children, ...props }: any) => (
        <TouchableOpacity style={styles.button} {...props}>
            <Text style={styles.buttonText1}>{children}</Text>
        </TouchableOpacity>
    );
    const fetchStorage = () => {
        AsyncStorage.getItem('scannedEData')
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
    const fetchMStorage = () => {
        AsyncStorage.getItem('scannedMData')
            .then((data) => {
                if (data) {
                    const scannedMDataFromStorage = JSON.parse(data);
                    setMA_NAME(scannedMDataFromStorage)
                    console.log('scannedEData retrieved from AsyncStorage:', scannedMDataFromStorage);
                } else {
                    console.log('No scannedEData found in AsyncStorage');
                }
            })
            .catch((error) => {
                console.error('Error retrieving scannedEData from AsyncStorage:', error);
            });
    }
    useEffect(() => {
        // Retrieve scannedEData from AsyncStorage
        fetchStorage();
        fetchMStorage();
    }, [route]);
    //Clear Async Storage 
    const clearScannedEDataFromStorage = async () => {
        try {
            await AsyncStorage.removeItem('scannedEData');
            setEM_NAME([]); // Set the scannedEData state to an empty array
        } catch (error) {
            console.error('Error clearing scannedEData from AsyncStorage:', error);
        }
    };
    const clearScannedMDataFromStorage = async () => {
        try {
            await AsyncStorage.removeItem('scannedMData');
            setMA_NAME([]); // Set the scannedEData state to an empty array
        } catch (error) {
            console.error('Error clearing scannedEData from AsyncStorage:', error);
        }
    };
    const clearScannedEmployeesDataFromStorage = async () => {
        try {
            await AsyncStorage.removeItem('scannedEmployeesData');
            setMA_NAME([]); // Set the scannedEData state to an empty array
        } catch (error) {
            console.error('Error clearing scannedEData from AsyncStorage:', error);
        }
    };
    const clearScannedMachinesDataFromStorage = async () => {
        try {
            await AsyncStorage.removeItem('scannedMachinesData');
            setMA_NAME([]); // Set the scannedEData state to an empty array
        } catch (error) {
            console.error('Error clearing scannedEData from AsyncStorage:', error);
        }
    };
    const E_Name = (data?.params5) ? data?.params5 : data?.data?.params5 || []
    const M_Name = (data?.params6) ? data?.params6 : data?.data?.params6 || []
    const newArray = EM_Name.map((employee: any) => {
        console.log(employee); // Log the employee object to the console
        // Now you can create the object you need
        return {
            id: employee.employee?._id, // Replace with the actual property name in your data
            name: employee.employee?.name, // Replace with the actual property name in your data
            profilePic: (employee?.profilePicture) ? (employee?.profilePicture) : ('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
        };
    });

    const new1Array = filteredMachineData?.map((employee: any) => ({
        id: employee.id, // Replace with the actual property name in your data
        name: employee.name, // Replace with the actual property name in your data
        status: false
    }));
    const employeeArray = [...newArray];
    console.log(newArray);
    const initialCheckedState: any = {};
    employeeArray.forEach((item: any) => {
        initialCheckedState[item?.status] = true;
    });
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", employeeArray);
    const [checkedItems, setCheckedItems] = useState(employeeArray);
    const toggleItem = (id: any, status: any) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Toggle the checked status based on the current status
        }));
    };

    const employeeArray33 = [...employees];
    console.log(employeeArray33);
    const initialCheckedState33: any = {};
    employeeArray33.forEach((item: any) => {
        initialCheckedState[item?.status] = true;
    });
    const [checkedItems33, setCheckedItems33] = useState(employeeArray33);
    const toggleItem2 = (id: any, status: any) => {
        setCheckedItems((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // Toggle the checked status based on the current status
        }));
    };
    const selectedEmployeeNames = employeeArray
        .filter((employee) => !checkedItems[employee.id])
        .map((employee) => employee.name);
    const selectedEmployeeIDs = employeeArray
        .filter((employee) => !checkedItems[employee.id])
        .map((employee) => employee.id);
    // Log the selected employee IDs
    // Send the selected employee IDs to the handleSelect1 function
    console.log(MA_Name);
    const selectedEmployeeNames33 = employeeArray33
        .filter((employee) => checkedItems[employee.id])
        .map((employee) => employee.name);
    const selectedEmployeeIDs33 = employeeArray33
        .filter((employee) => checkedItems[employee.id])
        .map((employee) => employee.id);
    // Log the selected employee IDs
    // Send the selected employee IDs to the handleSelect1 function
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<555555555", selectedEmployeeNames33, selectedEmployeeIDs33);
    const totalEmployees = [...selectedEmployeeNames, ...selectedEmployeeNames33]
    const totalEmployeesIds = [...selectedEmployeeIDs33, ...selectedEmployeeIDs]
    //Qr Scanned Machines
    const newMachineArray = MA_Name.map((employee: any) => ({
        id: employee?.machine._id, // Replace with the actual property name in your data
        name: employee?.machine.machineName, // Replace with the actual property name in your data
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
            [`${id}_${name}`]: !prevState[`${id}_${name}`], // Toggle the checked status using id and name as the key
        }));
    };
    const selectedMachinesNames2 = newMachineArray
        .filter((employee: any) => !checkedMachineItems[employee.id])
        .map((employee: any) => employee.name);
    const selectedMachinesIDs2 = newMachineArray
        .filter((employee: any) => !checkedMachineItems[employee.id])
        .map((employee: any) => employee.id);
    const machineArray = [...filteredEmployeeData];
    const initialCheckedState1: any = {};
    const [checkedItems1, setCheckedItems1] = useState(initialCheckedState1);
    const toggleItem1 = (id: any, name: any) => {
        setCheckedItems1((prevState: any) => ({
            ...prevState,
            [id]: !prevState[id], // Toggle the checked status
        }));
    };
    console.log(newArray);
    const selectedMachinesNames = machineArray
        .filter((employee) => checkedItems1[employee.machineId])
        .map((employee) => employee.machineName);
    const selectedMachinesIDs = machineArray
        .filter((employee) => checkedItems1[employee.machineId])
        .map((employee) => employee.machineId);
    const combinedMachinesIds = [...selectedMachinesIDs2, ...selectedMachinesIDs]
    const combinedMachineNames = [...selectedMachinesNames, ...selectedMachinesNames2]
    const uniqueMachineIds = [...new Set(combinedMachinesIds)]
    const uniqueMachineName = [...new Set(combinedMachineNames)]
    console.log("Selected Employee IDs:", uniqueMachineName);
    console.log("Selected Employee Names:", uniqueMachineIds);
    useEffect(() => {
        checkAllFields();
    }, [ScannedData, fromTime, totalEmployeesIds, uniqueMachineIds]);
    const checkAllFields = () => {
        const hasBasicFields =
            ScannedData?.productionSlip?.productionSlipNumber && fromTime;
        const hasAdditionalFields =
            totalEmployeesIds.length > 0 && uniqueMachineIds.length > 0;
        setIsButtonDisabled((el.scanRequired || el.contractBased) ? !hasBasicFields || !hasAdditionalFields : !hasBasicFields);
    };
    useEffect(() => {
        checkAllFields();
    }, [ScannedData, fromTime, selectedEmployeeIDs, uniqueMachineIds]);
    console.log("Hiiiiiiiiiiiiiiiiiissssssssssssssssssssssss", ScannedData?.productionSlip?.productionSlipNumber, fromTime, selectedEmployeeIDs, uniqueMachineIds);
    const handleAllotWork = () => {
        const allot = {
            productionSlipNumber: ScannedData?.productionSlip?.productionSlipNumber,
            durationFrom: fromTime ? fromTime : handleConfirm(Date.now()),
            employeeIds: totalEmployeesIds || [],
            machineIds: uniqueMachineIds || []
        };
        console.log(allot)
        dispatch(allotWorkAsync(allot)).then((response: any) => {
            console.log("Employee slip camera", response);
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "success",
                textBody: response.payload.message,
            })
            navigation.navigate("dashboard")
        }).catch((error: any) => {
            console.log("eooer meessage", error.message);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "failed",
                textBody: error.message,
            })
            navigation.navigate("dashboard")
        })
        clearScannedEDataFromStorage();
        clearScannedMDataFromStorage();
        clearScannedEmployeesDataFromStorage();
        clearScannedMachinesDataFromStorage();
    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (time: any) => {
        console.log("timeeeeeeeeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrr", Date.now());
        const dateTime = new Date(time);
        console.log("timeeeeeeeeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrr", dateTime);
        if (dateTime) {
            // Format the selected time as desired (e.g., HH:mm AM/PM)
            const hours = dateTime.getHours() % 12 || 12;
            const minutes = dateTime.getMinutes();
            const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            // Use a functional update to access the updated state value
            setFromTime((prevFromTime) => {
                return formattedTime;
            });
        }
        hideDatePicker();
    };
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <SafeAreaView>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={{ marginTop: 20 }}>
                        <View style={{ marginLeft: 20 }}>
                            <View >
                                <Text>{t('WORK ORDER')} #{ele?.orderNumber}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                }}
                            >
                                <View style={{ marginLeft: responsiveWidth(-6) }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontSize: 18,
                                            fontWeight: '700',
                                            height: 23,
                                        }}
                                    >
                                        {ele?.finishItemName}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ color: '#000' }}>{ele?.orderQuantity} Items</Text>
                                    <Text style={{ color: '#000' }}>(सामान)</Text>
                                </View>
                            </View>
                            <View style={{ borderWidth: 1, width: '43%', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                                <Text style={{ fontSize: 18, color: '#283093' }}>{el.contractBased ? "Contract" : "Non-Contract"}</Text>
                            </View>
                            <View style={{ flexDirection: 'row-reverse', marginRight: -15 }}>
                                <TouchableOpacity style={[
                                    styles.loginButton,
                                    isButtonDisabled && styles.disabledButton,
                                ]} onPress={() => handleAllotWork()} disabled={isButtonDisabled}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <View><Feather
                                            name={"navigation-2"}
                                            size={18}
                                            color={'white'}
                                        /></View>
                                        <View><Text style={styles.buttonText}>Allot Work (कार्य आवंटित करें)</Text></View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: -50 }}>
                        <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
                            <Text style={styles.TopGap}>{t('Production Slip')}</Text>
                            <View style={{ width: '100%', height: '12%', backgroundColor: '#F0F0F0', marginTop: 6, borderRadius: 5, borderWidth: 0.3, borderColor: '#4A4A4A', justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontWeight: '500', fontSize: 18 }}>{el?.part?.partName}-{el?.process?.processName}</Text></View>
                            <View>
                                <Text style={styles.TopGap}>{t('Duration')}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={showDatePicker}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={[styles.InputDuo, styles.self]}>{fromTime.length ? fromTime : String(handleConfirm(Date.now()))}</Text></View>
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 15 }}>To</Text>
                                    <Text style={[styles.InputDuo, styles.self]}>{toTime || 'To'}</Text>
                                </View>
                                <View>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="time"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                    />
                                </View>
                            </View>
                            <Text style={styles.TopGap}>{t('Employees')}</Text>
                            <TouchableOpacity style={styles.InputText} onPress={() => handleEmployeeSearch1()} >
                                <Text style={{ fontWeight: 'bold' }}>{totalEmployees ? totalEmployees.join(',') : ""}</Text>
                                <Feather
                                    name={"search"}
                                    size={20}
                                    style={{ marginLeft: '90%', textAlign: 'center' }}
                                />
                            </TouchableOpacity>
                            <Text style={styles.TopGap}>{t('Machines')}</Text>
                            {/* <View> */}
                            {/* <TextInput /> */}
                            <TouchableOpacity style={styles.InputText} onPress={() => handleMachineSearch()} >
                                <Text style={{ fontWeight: 'bold' }}>{uniqueMachineName ? uniqueMachineName.join(',') : ""}</Text>
                                <Feather
                                    name={"search"}
                                    size={20}
                                    style={{ marginLeft: '90%', textAlign: 'center', flex: 1 }}
                                />
                            </TouchableOpacity>
                            {/* </View> */}
                        </View>
                        <View style={{ marginLeft: responsiveWidth(6), height: responsiveHeight(30), marginTop: responsiveHeight(-5) }}>
                        </View>
                    </View>
                    <View>
                    </View>
                    {/* Machines */}
                    <View>
                        <Modal
                            isVisible={showModal}
                            style={styles.modal}
                            animationInTiming={600}
                            onBackdropPress={() => hideModal(false)}
                            onBackButtonPress={() => hideModal(false)}
                        >
                            <View style={[styles.modalContainer, { height: '80%' }]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        marginLeft: '10%',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: responsiveWidth(80),
                                            borderWidth: 1,
                                            height: responsiveHeight(6),
                                            marginRight: responsiveWidth(17),
                                        }}
                                    >
                                        <SearchBar
                                            placeholder="Search"
                                            onChangeText={query => setQuery(query)}
                                        />
                                    </View>
                                    <View style={{ marginRight: responsiveWidth(10) }}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('ScannedSlipMachinesCamera', { data })
                                            }
                                        >
                                            <Feather
                                                name={'camera'}
                                                size={30}
                                                color={'black'}
                                                style={{ marginLeft: 25 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', margin: '5%' }}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={toggleHandle}
                                    >
                                        <Text style={styles.modalText}>{t('QR SCANNED MACHINE')}</Text>
                                        <Feather
                                            name={expanded ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            style={{ marginLeft: '2%' }}
                                        />
                                    </TouchableOpacity>
                                    {/* //for qr scann list  */}
                                    <View style={{ maxHeight: responsiveHeight(40) }}>
                                        {expanded && (
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
                                                                    // flex: 1,
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
                                                                    {item.name.length > 15
                                                                        ? `${item.name.substring(0, 15)} ...`
                                                                        : item.name}
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
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: '5%',
                                        }}
                                        onPress={toggleHandle1}
                                    >
                                        <Text style={styles.modalText}>SUGGESTED MACHINES</Text>
                                        <Feather
                                            name={expanded1 ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            style={{ marginLeft: '2%' }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ maxHeight: responsiveHeight(40) }}>
                                        {expanded1 && (
                                            <FlatList
                                                data={handleEmployeeSearch(query)}
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
                                                                    {item.machineName}
                                                                </Text>
                                                            </View>
                                                            <View style={{}}>
                                                                <Checkbox.Android
                                                                    status={
                                                                        checkedItems1[item.machineId]
                                                                            ? 'checked'
                                                                            : 'unchecked'
                                                                    }
                                                                    onPress={() => {
                                                                        toggleItem1(item.machineId, item.machineName);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )
                                                )}
                                            />
                                        )}
                                    </View>
                                </View>
                                <Button onPress={() => handleMachineSearch()}>Done</Button>
                            </View>
                        </Modal>
                    </View>
                    <View>
                        <Modal
                            isVisible={showModal1}
                            style={styles.modal}
                            animationInTiming={600}
                            onBackdropPress={() => hideModal1(false)}
                            onBackButtonPress={() => hideModal1(false)}
                        >
                            <View style={[styles.modalContainer, { height: '80%' }]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                        marginLeft: '10%',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: responsiveWidth(80),
                                            borderWidth: 1,
                                            height: responsiveHeight(6),
                                            marginRight: responsiveWidth(17),
                                        }}
                                    >
                                        <SearchBar
                                            placeholder="Search"
                                            onChangeText={query => setEquery(query)}
                                        />
                                    </View>
                                    <View style={{ marginRight: responsiveWidth(10) }}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('ScannedSlipCamera', { data })
                                            }
                                        >
                                            <Feather
                                                name={'camera'}
                                                size={30}
                                                color={'black'}
                                                style={{ marginLeft: 5 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'column', margin: '5%' }}>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={toggleHandle}
                                    >
                                        <Text style={styles.modalText}>{t('QR SCANNED EMPLOYEES')}</Text>
                                        <Feather
                                            name={expanded ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            style={{ marginLeft: '2%' }}
                                        />
                                    </TouchableOpacity>
                                    {/* //for qr scann list  */}
                                    <View style={{ maxHeight: responsiveHeight(40) }}>
                                        {expanded && employeeArray && (
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
                                                                        {item?.name.length > 15
                                                                            ? `${item?.name.substring(0, 15)} ...`
                                                                            : item?.name}
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
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: '5%',
                                        }}
                                        onPress={toggleHandle1}
                                    >
                                        <Text style={styles.modalText}>SUGGESTED EMPLOYEES</Text>
                                        <Feather
                                            name={expanded1 ? 'chevron-up' : 'chevron-down'}
                                            size={20}
                                            style={{ marginLeft: '2%' }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ maxHeight: responsiveHeight(40) }}>
                                        {expanded1 && (
                                            <FlatList
                                                keyExtractor={(item, index) => `${item.id}_${item.text}_${index}`}
                                                data={handleEmployeeSearch11(eQuery)}
                                                renderItem={({ item }: any) => (
                                                    console.log("HIiiiiiiii", item),
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
                                                                            ? 'checked' : 'unchecked'
                                                                    }
                                                                    onPress={() => {
                                                                        toggleItem2(item.id, item.status);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    )
                                                )}
                                            />
                                        )}
                                    </View>
                                </View>
                                <Button onPress={() => handleEmployeeSearch1()}>Done</Button>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default ScannedSlip

const styles = StyleSheet.create({
    TopText: {
        marginLeft: '45%', color: '#666666', fontWeight: '500'
    },
    InputDuo: { width: responsiveWidth(35), height: responsiveHeight(5), borderRadius: 5, borderWidth: 0.3, marginTop: 10 },
    TopGap: { marginTop: '11%', fontSize: 18, color: '#1C1C1C', fontWeight: '400' },
    InputText: {
        width: '100%', height: '11%', marginTop: 6, borderRadius: 5, borderWidth: 0.3,
    },
    TimePickerInput: {
        // Your styles for the time picker input fields
    },
    ConfirmButton: {
        // Your styles for the confirm button
    },
    CancelButton: {
        // Your styles for the cancel button
    },
    self: {
        paddingLeft: responsiveWidth(8),
        paddingTop: responsiveHeight(1)
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: '#fff',
        // paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        // alignItems: 'center',
        borderRadius: 10
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
    },
    button: {
        // padding: 10,
        borderRadius: 5,
        marginTop: responsiveHeight(70),
        backgroundColor: '#283093',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        width: '100%',
        position: 'absolute',
        flex: 1,
    },
    buttonText1: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        // elevation: 3,
        shadowColor: '#000',
        // shadowOffset: { width: '100%', height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        width: '100%',
        // marginRight: '65%',
        maxHeight: '60%'
    },
    loginButton: {
        backgroundColor: '#283093',
        justifyContent: 'center',
        alignItems: 'center',
        height: responsiveHeight(8),
        borderRadius: 5,
        width: '40%',
    },
    disabledButton: {
        // Style for the disabled button
        backgroundColor: 'gray', // Gray background color for disabled button
        opacity: 0.6, // Reduce opacity for a disabled appearance
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
    },
    modalText: {
        color: '#B0B0B0',
        fontWeight: '600',
        fontSize: 18,
        letterSpacing: 1.5,
    },
})