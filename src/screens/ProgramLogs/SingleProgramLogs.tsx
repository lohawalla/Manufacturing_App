import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, ScrollView, Modal, Alert, TouchableWithoutFeedback, Touchable, BackHandler } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import Navbar from '../../components/Navbar/Navbar';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraIcon } from "react-native-heroicons/solid";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { childPartWorkOrderAsync, getAllWorkOrderAsync } from '../../redux/Slice/workOrderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { createLogAsync } from '../../redux/Slice/machineSlice';
import { deleteKeysFromAsyncStorage } from '../../components/AsyncStorage/AsynceStogaeRemove';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import Spinner from 'react-native-loading-spinner-overlay';

const SingleProgramLogs = ({ navigation }: any) => {
    const [fromTime, setFromTime] = useState('');
    const [endFromTime, setEndFromTime] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [expanded3, setExpanded3] = useState(false)
    const [expanded4, setExpanded4] = useState(false)
    const [expanded5, setExpanded5] = useState(false)
    const [selected, setSelected] = React.useState<any>([]);
    const [employeeData, setEmployeeData] = React.useState<any>([]);
    const [machineData, setMachineData] = React.useState<any>([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [isTimePickerVisible1, setTimePickerVisible1] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [logCreationLoading, setLogCreationLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [input, setInput] = useState('')
    const [index, setIndex] = useState('');
    const dispatch = useDispatch()
    const [startDate, setStartDate] = useState('Enter Start Date')
    const [endDateTime, setEndDateTime] = useState('Enter End Date')
    const [selectedOption101, setSelectedOption101] = useState('Sheet')
    const route = useRoute();
    const { displace }: any = route.params;
    console.log(displace);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => navigation.navigate('Programs'));
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', () => navigation.navigate('Programs'));
        };
    }, []);
    useEffect(() => {
        getAllWorkOrderAsync()
        childPartWorkOrderAsync()
        fetchingAsyncStorage();
    }, [route])
    useEffect(() => {
        setStartDate('Enter Start Date')
        setEndDateTime('Enter End Date')
    }, [displace])
    const workOrder = useSelector((state: any) => state.workOrder.allWorkOrders);
    const child = useSelector((state: any) => state.workOrder.childPartWorkOrders)
    const childPart: any = displace.map((child: any) => {
        const childPartArray = child.childParts.map((el: any) => {
            const partNameToFilter = el.childPart.childPartName;
            return {
                childPartName: [],
                childPartId: [],
                childPartProduced: [],
                weightPerChild: [],
            };
        });
        return childPartArray;
    });
    const [selectedOptions, setSelectedOptions] = useState<any>([]);
    const [selectedOptions1, setSelectedOptions1] = useState<any>([]);
    console.log(input);
    const handleValueChange = (itemValue: any, index1: any, id: any) => {
        console.log(itemValue, index1, id);
        setSelectedOptions((prevSelectedOptions: any) => {
            const newSelectedOptions = [...prevSelectedOptions];
            const updatedObject = { childPartId: index1, workOrderNumber: itemValue };
            newSelectedOptions.push(updatedObject);
            return newSelectedOptions;
        });
        setSelectedOptions1((prevSelectedOptions: any) => {
            const newOption = [...prevSelectedOptions];
            newOption[+index] = itemValue
            return newOption;
        })
        setIsDropdownVisible(false);
    };
    const removeDuplicates = (arr: any) => {
        const uniqueMap = new Map();
        const uniqueObjects = arr.reduce((result: any, obj: any) => {
            if (!uniqueMap.has(obj.childPartId)) {
                uniqueMap.set(obj.childPartId, true);
                result.push(obj);
            }
            return result;
        }, []);
        return uniqueObjects;
    };
    console.log(removeDuplicates(selectedOptions));
    console.log(selectedOptions1);
    const fetchingAsyncStorage = () => {
        AsyncStorage.getItem('programEData')
            .then((data) => {
                if (data) {
                    const scannedEDataFromStorage = JSON.parse(data);
                    setEmployeeData(scannedEDataFromStorage)
                    console.log('scannedEData retrieved from AsyncStorage:', scannedEDataFromStorage);
                } else {
                    console.log('No scannedEData found in AsyncStorage');
                }
            })
            .catch((error) => {
                console.error('Error retrieving scannedEData from AsyncStorage:', error);
            });
        AsyncStorage.getItem('programMData')
            .then((data) => {
                if (data) {
                    const scannedEDataFromStorage = JSON.parse(data);
                    setMachineData(scannedEDataFromStorage)
                    console.log('scannedEData retrieved from AsyncStorage:', scannedEDataFromStorage);
                } else {
                    console.log('No scannedEData found in AsyncStorage');
                }
            })
            .catch((error) => {
                console.error('Error retrieving scannedEData from AsyncStorage:', error);
            });
    }
    console.log(machineData);
    const newArray = employeeData.map((employee: any) => {
        return {
            id: employee.employee?._id,
            name: employee.employee?.name,
            profilePic: (employee?.profilePicture) ? (employee?.profilePicture) : ('https://cdn-icons-png.flaticon.com/512/3135/3135715.png')
        };
    });
    const newMachineArray = machineData.map((employee: any) => ({
        id: employee?.machine._id,
        name: employee?.machine.machineName,
    }));
    console.log(newMachineArray)
    const [checkedItems, setCheckedItems] = React.useState<any>(newArray);
    const toggleItem = (id: any) => {
        setCheckedItems((prevState: any) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    const selectedEmployeeNames = newArray
        .filter((employee: any) => !checkedItems[employee.id])
        .map((employee: any) => employee.name);
    const selectedEmployeeIDs = newArray
        .filter((employee: any) => !checkedItems[employee.id])
        .map((employee: any) => employee.id);
    const [checkedMachineItems, setCheckedMachineItems] = React.useState<any>(newMachineArray);
    const toggleMachineItem = (id: any) => {
        setCheckedMachineItems((prevState: any) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    const toggleDropdown = (id: any, index: any) => {
        setLoading(true);
        dispatch(childPartWorkOrderAsync(id))
            .then((result: any) => {
                console.log('Dispatch successful:', result);
            })
            .catch((error: any) => {
                console.error('Dispatch error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        setId(id);
        setIndex(index);
        setIsDropdownVisible(!isDropdownVisible);
    };
    const handleDropdownSelect = (value: any) => {
        setSelectedValue(value);
        setIsDropdownVisible(false);
    };
    const selectedMachineNames = newMachineArray
        .filter((employee: any) => !checkedMachineItems[employee.id])
        .map((employee: any) => employee.name);
    const selectedMachineIDs = newMachineArray
        .filter((employee: any) => !checkedMachineItems[employee.id])
        .map((employee: any) => employee.id);
    console.log(selectedMachineIDs);
    console.log(selectedMachineNames);
    const data = [
        { key: '1', value: 'Jammu & Kashmir' },
        { key: '2', value: 'Gujrat' },
        { key: '3', value: 'Maharashtra' },
        { key: '4', value: 'Goa' },
    ];
    const handleSelect = useCallback((selectedItems: any) => {
        setSelected(selectedItems);
    }, []);
    const toggleTimePicker = () => {
        setTimePickerVisible(!isTimePickerVisible);
    };
    const hideTimePicker = () => {
        setTimePickerVisible(false);
    };
    const toggleTimePicker1 = () => {
        setTimePickerVisible1(!isTimePickerVisible1);
    };
    const hideTimePicker1 = () => {
        setTimePickerVisible1(false);
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const showDatePicker1 = () => {
        setDatePickerVisibility1(true);
    };
    const hideDatePicker1 = () => {
        setDatePickerVisibility1(false);
    };
    const handleConfirm2 = (date: any) => {
        const sendingDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        setStartDate(sendingDate)
        hideTimePicker()
        console.log(sendingDate);
    }
    const handleConfirm3 = (date: any) => {
        const sendingDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        setEndDateTime(sendingDate)
        hideTimePicker1();
        console.log(sendingDate);
    }
    const handleConfirm = (time: any) => {
        const dateTime = new Date(time);
        if (dateTime) {
            const hours = dateTime.getHours() % 12 || 12;
            const minutes = dateTime.getMinutes();
            const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            setFromTime((prevFromTime) => {
                return formattedTime;
            });
        }
        hideDatePicker();
    };
    const handleConfirm1 = (time: any) => {
        const dateTime = new Date(time);
        if (dateTime) {
            const hours = dateTime.getHours() % 12 || 12;
            const minutes = dateTime.getMinutes();
            const ampm = dateTime.getHours() >= 12 ? 'pm' : 'am';
            const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            setEndFromTime((prevFromTime) => {
                return formattedTime;
            });
        }
        hideDatePicker1();
    };
    useEffect(() => {
        checkAllFields();
    }, [fromTime, selectedMachineIDs, selectedEmployeeIDs, input, endFromTime, startDate, endDateTime]);
    const checkAllFields = () => {
        if (
            fromTime &&
            selectedMachineIDs.length && selectedEmployeeIDs.length && input.length > 0 && endFromTime && startDate !== "Enter Start Date" && endDateTime !== "Enter End Date"
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    };
    console.log(fromTime, selectedMachineIDs.length, selectedEmployeeIDs.length, input, endFromTime, isButtonDisabled, selectedOption101)
    const handleGenerate = () => {
        if (childPart[0].length > 0) {
            setExpanded5(true)
        } else {
            const data = {
                childArray: [],
                employees: selectedEmployeeIDs,
                machines: selectedMachineIDs,
                sheetQuantity: +input,
                endTime: endFromTime,
                startTime: fromTime,
                sheetType: selectedOption101
            }
            console.log(data)
            const id = displace[0]._id
            console.log(displace[0]);
            console.log(id);
            dispatch(createLogAsync({ id, data })).then((result: any) => {
                const { success } = result.payload;
                console.log('Log created:', success);
                if (success) {
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: "New Program Created Successfully",
                        button: 'close',
                    })
                    const keysToDelete = ['programEData', 'programMData', 'scannedBarcodedEmployeesData', 'scannedBarcodeMachineData']
                    deleteKeysFromAsyncStorage(keysToDelete).then((res) => {
                        console.log(res)
                    })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Failed",
                        textBody: "Error Creating New Program",
                        button: 'close',
                    })
                }
                navigation.navigate('Programs');
            })
                .catch((error: any) => {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Failed",
                        textBody: "Error Creating New Program",
                        button: 'close',
                    })
                    console.error('Error creating log:', error);
                });
        }
    }
    const handleCreateLogs = () => {
        console.log(childPart[0], selectedOptions)
        console.log(selectedOptions)
        const newArray = childPart[0].map((item: any, index: any) => {
            return {
                workOrderNumber: selectedOptions[index],
                childPartId: item.childPartId
            }
        })
        console.log(newArray)
        const data = {
            employees: selectedEmployeeIDs,
            machines: selectedMachineIDs,
            sheetQuantity: +input,
            endTime: endFromTime,
            endDate: endDateTime,
            startTime: fromTime,
            startDate: startDate,
            sheetType: selectedOption101
        }
        console.log(data)
        const id = displace[0]._id
        console.log(displace[0]);
        console.log(id);
        setLogCreationLoading(true);
        dispatch(createLogAsync({ id, data })).then((result: any) => {
            const { success } = result.payload;
            console.log('Log created:', success);
            if (success) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: "New Program Created Successfully",
                    button: 'close',
                })
                const keysToDelete = ['programEData', 'programMData', 'scannedBarcodedEmployeesData', 'scannedBarcodeMachineData']
                deleteKeysFromAsyncStorage(keysToDelete).then((res) => {
                    console.log(res)
                    navigation.navigate('Program');
                })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Failed",
                    textBody: "Error Creating New Program",
                    button: 'close',
                })
                navigation.navigate('Program');
            }
            setLogCreationLoading(false);
            navigation.navigate('Program');
        })
            .catch((error: any) => {
                // Handle errors here if the operation fails
                setLogCreationLoading(false);
                console.error('Error creating log:', error);
            });
    }
    if (logCreationLoading) {
        return <Spinner
            visible={logCreationLoading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
        />;
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />
            <ScrollView style={{ padding: 15, flex: 1, maxHeight: '98%' }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text numberOfLines={2} style={{ fontSize: 25, color: '#000', fontWeight: '700' }}>{displace[0]?.CNCProgramName}</Text>
                    <Text style={{ fontSize: 15, color: '#9ca3af', fontWeight: '700' }}>{displace[0]?.CNCProgramNumber}</Text>
                    <Text style={{ fontSize: 15, color: '#9ca3af', fontWeight: '700' }}>Sheet Pending: {displace[0]?.sheetPending}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: '40%' }}>
                    <Text style={{ fontSize: 18, color: '#000', fontWeight: '700', marginTop: '10%' }}>ADD VALUE</Text>
                    <View>
                        <TouchableOpacity onPress={() => handleCreateLogs()} style={[styles.loginButton, isButtonDisabled && styles.disabledButton]} disabled={isButtonDisabled}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Feather name='plus' size={30} color={'white'} />
                                <Text style={styles.buttonText}>Generate Program</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 3 }}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>Person</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.inputField1} onPress={() => setExpanded3(!expanded3)}>
                                <Text style={styles.inputText}>{selectedEmployeeNames.join(', ')}</Text>
                            </TouchableOpacity>
                            <View style={styles.modalContainer}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Modal
                                        visible={expanded3}
                                        transparent={true}
                                        animationType="slide"
                                        onRequestClose={() => setExpanded3(false)}
                                    >
                                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: 'white', borderRadius: 10, width: '80%', flex: 1, maxHeight: '35%' }}>
                                                <ScrollView contentContainerStyle={{ padding: 20 }}>
                                                    {newArray.length ? (newArray.map((item: any) => (
                                                        <View
                                                            key={item.id}
                                                            style={[
                                                                styles.card,
                                                                {
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    backgroundColor: 'white'
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
                                                                            marginLeft: -40
                                                                        }}
                                                                    >
                                                                        {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View>
                                                                <Checkbox.Android
                                                                    status={!checkedItems[item.id] ? 'checked' : 'unchecked'}
                                                                    onPress={() => {
                                                                        toggleItem(item.id);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    ))) : (<Text style={{ color: 'black', fontSize: 18 }}>Noo Employees</Text>)}
                                                </ScrollView>
                                                <View style={{ alignSelf: 'flex-end', padding: 20 }}>
                                                    <TouchableOpacity onPress={() => setExpanded3(false)}>
                                                        <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('ProgramEmployeeCamera', displace)}>
                                <Text>
                                    <CameraIcon color="black" fill="black" size={45} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>Machines</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.inputField1} onPress={() => setExpanded4(!expanded4)}>
                                <Text style={styles.inputText}>{selectedMachineNames.join(', ')}</Text>
                            </TouchableOpacity>
                            <View style={styles.modalContainer}>
                                <View style={{ flexDirection: 'column' }}>
                                    <Modal
                                        visible={expanded4}
                                        transparent={true}
                                        animationType="slide"
                                        onRequestClose={() => setExpanded4(false)}
                                    >
                                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ backgroundColor: 'white', borderRadius: 10, width: '80%', flex: 1, maxHeight: '35%' }}>
                                                <ScrollView contentContainerStyle={{ padding: 20 }}>
                                                    {newMachineArray.length ? (newMachineArray.map((item: any) => (
                                                        <View
                                                            key={item.id}
                                                            style={[
                                                                styles.card,
                                                                {
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    backgroundColor: 'white'
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
                                                                <View style={{}}>
                                                                    <Text
                                                                        style={{
                                                                            color: '#666666',
                                                                            fontWeight: '500',
                                                                            fontSize: 14,
                                                                            lineHeight: 16.94,
                                                                            marginLeft: -40
                                                                        }}
                                                                    >
                                                                        {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View>
                                                                <Checkbox.Android
                                                                    status={!checkedMachineItems[item.id] ? 'checked' : 'unchecked'}
                                                                    onPress={() => {
                                                                        toggleMachineItem(item.id);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    ))) : (<Text style={{ color: 'black', fontSize: 18 }}>Noo Machines</Text>)}
                                                </ScrollView>
                                                <View style={{ alignSelf: 'flex-end', padding: 20 }}>
                                                    <TouchableOpacity onPress={() => setExpanded4(false)}>
                                                        <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('ProgramMachineCamera', displace)}>
                                <Text>
                                    <CameraIcon color="black" fill="black" size={45} />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.label}>Sheet Quantity Planned: {displace[0]?.sheetQuantityPlanned}</Text>
                            <TextInput style={styles.inputField} onChangeText={(item) => setInput(item)} keyboardType='numeric' keyboardAppearance='dark' />
                        </View>
                        <View style={{
                            width: 130,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            borderWidth: 1,
                            height: 54,
                            marginTop: 20,
                            borderColor: 'black'
                        }}>
                            <Picker
                                style={{
                                    color: 'black',
                                    fontWeight: '600',
                                }}
                                selectedValue={selectedOption101}
                                onValueChange={(itemValue: any) => setSelectedOption101(itemValue)}
                            >
                                <Picker.Item label='Sheet' value='Sheet' />
                                <Picker.Item label='Drop' value='Drop' />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>Start Time/Date</Text>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => showDatePicker()} style={styles.inputField2}>
                                <Text >{fromTime.length ? fromTime : String(handleConfirm(Date.now()))}</Text>
                                <Text>              |      </Text>
                                <Text>{startDate}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleTimePicker()} >
                                <Feather
                                    name='calendar'
                                    size={40}
                                    style={{ color: '#000' }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="time"
                            is24Hour={false}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <View>
                        <DateTimePickerModal
                            isVisible={isTimePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm2}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>End Time/Date</Text>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => showDatePicker1()} style={styles.inputField2}>
                                <Text >{endFromTime.length ? endFromTime : String(handleConfirm1(Date.now()))}</Text>
                                <Text>              |      </Text>
                                <Text>{endDateTime}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleTimePicker1()} >
                                <Feather
                                    name='calendar'
                                    size={40}
                                    style={{ color: '#000' }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible1}
                            mode="time"
                            is24Hour={false}
                            onConfirm={handleConfirm1}
                            onCancel={hideDatePicker1}
                        />
                    </View>
                    <View>
                        <DateTimePickerModal
                            isVisible={isTimePickerVisible1}
                            mode="date"
                            onConfirm={handleConfirm3}
                            onCancel={hideDatePicker}
                        />
                    </View>
                </View>
                <View style={styles.modalContainer}>
                    <View style={{ flexDirection: 'column' }}>
                        <Modal
                            visible={expanded5}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setExpanded5(false)}
                        >
                            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ backgroundColor: 'white', borderRadius: 10, width: '90%', flex: 1, maxHeight: '55%' }}>
                                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                                        {childPart.length ? (
                                            <FlatList
                                                data={childPart[0]}
                                                keyExtractor={(item, index) => index.toString()} // Add a unique key for each item
                                                ListHeaderComponent={
                                                    <View>
                                                        <Text style={{ color: '#000', fontSize: 25, textAlign: 'center', fontWeight: '700' }}>Child Part Details</Text>
                                                    </View>
                                                }
                                                renderItem={({ item, index }: { item: any; index: number }) => {
                                                    console.log(index)
                                                    return (
                                                        <View
                                                            style={[
                                                                styles.card,
                                                                {
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    backgroundColor: 'white',
                                                                    marginTop: '15%'
                                                                },
                                                            ]}
                                                        >
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#312e81' }}>
                                                                <View >
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <View>
                                                                            <Text
                                                                                style={{
                                                                                    color: '#000',
                                                                                    fontWeight: '900',
                                                                                    fontSize: 16,
                                                                                    lineHeight: 18.94,
                                                                                }}
                                                                            >
                                                                                Name:{item.childPartName}
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                    <Text
                                                                        style={{
                                                                            color: '#000',
                                                                            fontWeight: '500',
                                                                            fontSize: 15,
                                                                            lineHeight: 16.94,
                                                                        }}
                                                                    >
                                                                        Produced:{item.childPartProduced}
                                                                    </Text>
                                                                    <Text
                                                                        style={{
                                                                            color: '#000',
                                                                            fontWeight: '500',
                                                                            fontSize: 15,
                                                                            lineHeight: 16.94,
                                                                        }}
                                                                    >
                                                                        Weight/Part:{item.weightPerChild}
                                                                    </Text>
                                                                    <View style={styles.workOrderContainer}>
                                                                        <View style={styles.workOrderLabel}>
                                                                            <Text style={styles.labelText}>Work Order:</Text>
                                                                            <Text style={styles.selectWorkOrder}>{selectedOptions1[index]}</Text>
                                                                        </View>
                                                                        <View style={styles.container}>
                                                                            <TouchableOpacity onPress={() => toggleDropdown(item.childPartId, index)}>
                                                                                <Text style={styles.selectWorkOrder}>Select Work Order</Text>
                                                                            </TouchableOpacity>
                                                                            <Modal visible={isDropdownVisible} transparent animationType="fade">
                                                                                <TouchableWithoutFeedback >
                                                                                    <View style={styles.modalOverlay} />
                                                                                </TouchableWithoutFeedback>
                                                                                <ScrollView>
                                                                                    <View style={styles.dropdownContent}>
                                                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                                                                            <Text style={styles.dropdownHeader}>Select Dropdown Process</Text>
                                                                                            <TouchableOpacity onPress={() => setIsDropdownVisible(false)}><Feather name='x' size={27} color={'black'} /></TouchableOpacity>
                                                                                        </View>
                                                                                        {loading ? <Text>Loading...</Text> : child.map((item: any) => (
                                                                                            console.log(index, item),
                                                                                            <TouchableOpacity
                                                                                                key={item.workOrderNumber}
                                                                                                style={styles.dropdownItem}
                                                                                                onPress={() => handleValueChange(item.workOrderNumber, id, index)}
                                                                                            >
                                                                                                <Text style={{ fontWeight: 'bold', color: 'white', marginLeft: 20 }}>{`${item.workOrderNumber} - PendingReq: ${item.pendingReq}`}</Text>
                                                                                            </TouchableOpacity>
                                                                                        ))}
                                                                                    </View>
                                                                                </ScrollView>
                                                                            </Modal>
                                                                        </View>
                                                                        {/* <View style={styles.pickerContainer}>
                                                                            <Picker
                                                                                style={styles.picker}
                                                                                selectedValue={selectedOptions[index]}
                                                                                onValueChange={(itemValue: any) => handleValueChange(itemValue, index)}
                                                                            >
                                                                                <Picker.Item label="Select Process" value='' />
                                                                                {child.map((item: any, index: any) => (
                                                                                    <Picker.Item
                                                                                        key={item.workOrderNumber}
                                                                                        label={`${item.workOrderNumber} - PendingReq: ${item.pendingReq}`}
                                                                                        value={item.workOrderNumber}
                                                                                    />
                                                                                ))}
                                                                            </Picker>
                                                                        </View> */}
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        ) : (
                                            <Text style={{ color: 'black', fontSize: 18 }}>No Data</Text>
                                        )}
                                    </ScrollView>
                                    <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-evenly', marginLeft: '13%' }}>
                                        <TouchableOpacity onPress={() => setExpanded5(false)} style={styles.loginButton33}>
                                            <Feather name='x' size={30} color={'white'} />
                                            <Text style={styles.buttonText33}>Close</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleCreateLogs()} style={styles.loginButton33}>
                                            <Feather name='check' size={30} color={'white'} />
                                            <Text style={styles.buttonText33}>OK</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View >
            </ScrollView >
        </View >
    )
}
export default SingleProgramLogs
const styles = StyleSheet.create({
    InputText: {
        width: '100%', height: '29%', marginTop: 6, borderRadius: 5, borderWidth: 0.3,
    },
    itemContainer: {
        marginBottom: 10, // Add the desired spacing between items
        marginTop: 10, // Add the desired spacing between items
    },
    label: {
        fontSize: 16, // Adjust the font size as needed
        fontWeight: 'bold', // Add bold styling if desired
    },
    inputField: {
        borderWidth: 1, // Add border styling if needed
        borderColor: 'black', // Adjust the border color as desired
        padding: 10, // Add padding for the input field
        flexDirection: 'row', // Align items horizontally if needed
        alignItems: 'center', // Align items vertically if needed
        borderRadius: 5,
        width: '95%'
    },
    inputField2: {
        borderWidth: 1, // Add border styling if needed
        borderColor: 'black', // Adjust the border color as desired
        padding: 16, // Add padding for the input field
        flexDirection: 'row', // Align items horizontally if needed
        alignItems: 'center', // Align items vertically if needed
        borderRadius: 5,
        width: '80%'
    },
    inputText: {
        color: 'black', // Change text color if desired
        marginLeft: 10, // Adjust the left margin for the input text
    },
    searchIcon: {
        marginLeft: 'auto', // Push the icon to the right side
        textAlign: 'center', // Center the icon horizontally
    },
    inputField1: {
        borderWidth: 1, // Add border styling if needed
        borderColor: 'black', // Adjust the border color as desired
        padding: 15, // Add padding for the input field
        // Align items vertically if needed
        width: '85%',
        justifyContent: 'space-evenly',
        borderRadius: 5,
        // flexDirection: 'column'
    },
    dropdownContainer: {
        position: 'absolute',
        top: '100%', // Position it just below the input field
        backgroundColor: '#e7e5e4',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'lightgray',
        width: '85%', // Adjust the width as needed
        maxHeight: 200, // Adjust the maximum height as needed
        overflow: 'hidden',
        height: '10%'
    },
    dropdownList: {
        padding: 10,
        backgroundColor: '#e7e5e4'
    },
    card: {
        padding: 5,
        // borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        backgroundColor: '#e7e5e4'
    },
    itemText: {
        color: '#666666',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 16.94,
        marginLeft: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Background overlay,
        width: '100%'
    },
    loginButton: {
        // backgroundColor: '#283093',
        backgroundColor: '#312e81',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        width: responsiveWidth(37),
        position: 'absolute',
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
        paddingVertical: '10%'
    },
    disabledButton: {
        // Style for the disabled button
        backgroundColor: 'gray', // Gray background color for disabled button
        opacity: 0.6, // Reduce opacity for a disabled appearance
    },
    loginButton33: {
        // backgroundColor: '#283093',
        backgroundColor: '#312e81',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        width: responsiveWidth(29),
        paddingVertical: '4.5%',
        flexDirection: 'row'
    }
    ,
    buttonText33: {
        color: 'white',
        paddingLeft: 15,
        fontSize: 18
    },
    workOrderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    workOrderLabel: {
        flex: 1,
        marginRight: 10,
        flexDirection: 'row'
    },
    labelText: {
        color: '#000',
        fontWeight: '500',
        fontSize: 12.30,
        lineHeight: 18.94,
    },
    pickerContainer: {
        flex: 2,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        backgroundColor: '#f5f5f4',
    },
    picker: {
        color: '#000',
        fontWeight: '600',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectWorkOrder: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
        textDecorationLine: 'underline',
    },
    modalOverlay: {
        // flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        width: '90%',
        minHeight: 5,
        alignSelf: 'center',
        marginTop: '30%',
        zIndex: 1000,
        borderWidth: 2
    },
    dropdownHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    dropdownItem: {
        paddingVertical: 8,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: 'red',
        marginTop: 5
    },
})


