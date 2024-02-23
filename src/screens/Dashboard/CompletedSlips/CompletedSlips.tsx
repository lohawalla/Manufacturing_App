import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Modal, Image, RefreshControl, BackHandler, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../../components/Navbar/Navbar';
import { useAuthContext } from '../../../auth/AuthGuard';
import Feather from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { editProductionAsync, getSlipsOneDetailAsync } from '../../../redux/Slice/workOrderSlice';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { styles } from './styles';
import { Checkbox } from 'react-native-paper';
import { useUpdateGameMutation } from '../../../redux/features/apis2/Manufacturing';
import { scanProductionSlipAsync, suggestedEmployeesAsync, suggestedMachinesAsync } from '../../../redux/Slice/productionSlice';
import { Alert } from 'react-native';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
const formatDateUTC = (str: any) => {
    const date = new Date(str);
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    let hours = date.getHours() === 0 ? 12 : date.getHours() >= 13 ? date.getHours() - 12 : date.getHours();
    const minutes = date.getMinutes();
    let amPm = date.getHours() >= 12 ? "pm" : "am"
    const year = date.getFullYear();
    return `${hours}:${minutes} ${amPm}, ${day}/${month}/${year}`;
}
const CompletedSlips = ({ navigation }: any) => {
    const { t } = useTranslation();
    const auth: any = useAuthContext();
    const dispatch = useDispatch();
    const route: any = useRoute();
    const { data, type } = route.params
    const [mod, setMod] = useState(false);
    const [modal, setModal] = useState<any>(false);
    const [info, setInfo] = useState([{}]);
    const [upto, setUpto] = useState<any>();
    const [isModalProductionLogVisible, setIsModalProductionLogVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [timeElapsed, setTimeElapsed] = useState(false);
    const [processName, setprocessName] = useState<any>([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [item, setItem] = useState<any>([])
    const [produced, setProduced] = useState('');
    const [checked, setChecked] = useState([]);
    const [sort, setSort] = useState(false);
    const [selectedOption4, setSelectedOption4] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeElapsed1, setTimeElapsed1] = useState('');
    const formatDate = (date: any) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const closeModal2 = () => {
        setModal(false);
    };
    const toggelItem = (id: any) => {
        console.log(id);
        setChecked((prev: any) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }
    const arr: any = []
    console.log(data, checked, arr, auth?.authData?.jobProfileId?.jobProfileName.split(" ").filter((el: any) => el != 'SUPERVISOR' && el !== 'SUPERWISOR').join(''))
    for (const i in checked) {
        checked[i] == true ? arr.push(i) : "";
    }
    const flatListData: any = data.map((item: any) => ({
        key: item._id,
        numberOfItems: item.numberOfItems,
        itemProduced: item.itemProduced,
        consumedItemPartName: 'N/A',
        process: item?.process.processName ? item.process.processName : item.process,
        part: item?.part.partName ? item.part.partName : item.part,
        finishItemName: (item?.workOrderId.finishItemName) ? item?.workOrderId?.finishItemName : '',
        productionSlip: item?.productionSlipNumber,
        partId: !(item.part?._id) ? (item?._id) : (item.part?._id),
        orderNumber: item?.workOrderId.orderNumber,
        createdAt: item?.createdAt,
        activatedAt: item?.durationFrom,
        contractBased: (item?.contractBased) ? true : false,
        alreadyScanned: (item?.alreadyScanned) ? true : false,
        partCode: (item?.workOrderId?.partCode) ? (item?.workOrderId.partCode) : '',
        MCode: (item?.workOrderId?.MCode) ? (item?.workOrderId?.MCode) : ''
    }));
    const handleSelect = () => {
        for (let i = 0; i < flatListData.length; i++) {
            console.log(flatListData[i])
            setChecked((prev: any) => ({
                ...prev,
                [flatListData[i].productionSlip]: !prev[flatListData[i].productionSlip]
            }))
        }
        setSort(!sort)
    }
    console.log(flatListData);
    const searchData = (searchQuery: any) => {
        console.log(searchQuery)
        if (!searchQuery) {
            return flatListData;
        }
        if (searchQuery === 'Latest' || searchQuery === 'Oldest') {
            const sortedData = [...flatListData];
            sortedData.sort((a: any, b: any) => {
                const dateA: any = new Date(a.createdAt);
                const dateB: any = new Date(b.createdAt);
                return searchQuery === 'Latest' ? dateB - dateA : dateA - dateB;
            });
            console.log(sortedData);
            return sortedData;
        }
        searchQuery = searchQuery.toLowerCase();
        return flatListData.filter((item: any) => {
            const part = item.part.toLowerCase();
            const process = item.process.toLowerCase();
            const slipNumber = item.productionSlip.toLowerCase();
            const orderNumber = item?.orderNumber.toLowerCase();
            const partCode = item?.partCode.toLowerCase();
            const MCode = item?.MCode.toLowerCase();
            return part.includes(searchQuery) || process.includes(searchQuery) || slipNumber.includes(searchQuery) || orderNumber.includes(searchQuery) || partCode.includes(searchQuery) || MCode.includes(searchQuery);
        });
    };
    const fetchShop = async () => {
        try {
            const res = await axios.get(`https://chawlacomponents.com/api/v1/globalProcess/shopProcess`);
            console.log('processs', res);
            setprocessName(res.data.process);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const handleBackButton = () => {
        navigation.navigate("dashboard");
        return true;
    };
    const handlePrevDate = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
    };
    console.log("Date", selectedDate);
    const handleNextDate = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
    };
    useEffect(() => {
        fetchShop()
    }, [])
    const data2 = useSelector((item: any) => item.workOrder.SlipsDetail)
    console.log(data2)
    const handlePress = (item: any) => {
        setUpto('')
        setModal(true);
        console.log(item);
        setMod(true);
        dispatch(getSlipsOneDetailAsync(item.key)).then((res: any) => {
            console.log(res);
            console.log(data2);
            const data = data2.working;
            console.log(data);
            if (data.length > 0) {
                const machineNames = data.reduce((acc: any, item: any) => {
                    item.machines.forEach((machine: any) => {
                        console.log(machine);
                        acc.push(machine.machineName);
                    });
                    return acc;
                }, []);
                const employeeName = data.reduce((acc: any, item: any) => {
                    item.employees.forEach((employee: any) => {
                        console.log(employee);
                        acc.push(employee.employeeName);
                    });
                    return acc;
                }, []);
                console.log(data);
                const update = data.reduce((acc: any, item: any) => {
                    acc.push(item.updatedBy.name);
                    acc.push(item.startTime);
                    return acc;
                }, []);
                console.log(machineNames);
                console.log(employeeName);
                console.log(update);
                const updated: any = {
                    machineNames: machineNames,
                    employeeNames: employeeName,
                    updates: update,
                    part: item.part,
                    process: item.process,
                };
                console.log(updated);
                setInfo((prevInfo) => {
                    return [updated];
                });
                setUpto(updated);
                console.log(info);
            }
            setMod(false)
        });
        console.log(info);
    };
    useEffect(() => {
        console.log(info.length);
        console.log([upto]);
    }, [info, upto]);
    console.log(info.length)
    console.log(formatDate(selectedDate))
    const calculateTimeElapsed = (startTime: any) => {
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
    function isTimeWithin24Hours(endTime: any) {
        const endDateTime: any = new Date(endTime);
        console.log(endDateTime);
        const currentDateTime: any = new Date();
        console.log(currentDateTime);
        const timeDifference = currentDateTime - endDateTime;
        console.log(timeDifference);
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        console.log(hoursDifference);
        return hoursDifference < 24;
    }
    const endTime = "2023-10-21T14:03:00.000Z";
    const isWithin24Hours = isTimeWithin24Hours(endTime);
    console.log(isWithin24Hours);
    const handleOKLog = (item: any) => {
        setIsModalProductionLogVisible(!isModalProductionLogVisible)
        setItem(item)
        console.log(item);
        console.log("ok pressed");
    }
    const handleDirectProduction = async (data: any) => {
        console.log("Hi");
        const errorMessages = [];
        let dataToNavigate = null;
        if (data) {
            setLoading(true);
            console.log(data);
            const response1 = await dispatch(scanProductionSlipAsync(data));
            const response2 = await dispatch(suggestedMachinesAsync(data));
            const response3 = await dispatch(suggestedEmployeesAsync(data));
            console.log('Response 1:', response1);
            console.log('Response 2:', response2);
            console.log('Response 3:', response3);
            errorMessages.push(response1.payload instanceof Error ? response1.payload.message : null);
            errorMessages.push(response2.payload instanceof Error ? response2.payload.message : null);
            errorMessages.push(response3.payload instanceof Error ? response3.payload.message : null);
            setLoading(false);
            if (!errorMessages.some((errorMessage) => errorMessage !== null)) {
                dataToNavigate = data;
            }
        }
        if (errorMessages.some((errorMessage) => errorMessage !== null)) {
            console.warn(errorMessages.filter(Boolean).join('\n'));
            Alert.alert('Error Occurred', errorMessages.filter(Boolean).join('\n'));
            Vibration.vibrate();
            navigation.navigate("dashboard");
        } else if (dataToNavigate !== null) {
            Vibration.vibrate();
            navigation.navigate('ScannedSlip', { data: dataToNavigate });
        }
    };

    const handleCall = (accept: any) => {
        console.log(accept);
        const productionSlipNumber = accept.productionSlipNumber;
        const apiData = {
            itemProduced: +produced,
            index: 0
        }
        dispatch(editProductionAsync({ productionSlipNumber, apiData })).then((res: any) => {
            if (res.payload.success == true) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: "Production Slip Updated Successfully",
                    button: 'close',
                })
                setIsModalProductionLogVisible(false)
                navigation.navigate('dashboard', { R: 'hii' })
            }
        });
    }
    const [addPost, { data: allSlips, isError: slipsError, isLoading: slipsLoading }] = useUpdateGameMutation();
    console.log(arr, allSlips, slipsError, slipsLoading);
    const handleCancelPress = async () => {
        await addPost({
            productionSlipNumbers: arr,
            status: "cancel"
        });
        setTimeElapsed(true);
        navigation.navigate('dashboard');
    };
    const searchResults = selectedOption || selectedOption4 ? searchData(selectedOption || selectedOption4) : searchData(searchQuery)
    console.log(searchResults)
    if (loading) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />
            <View style={{ padding: 15, flex: 1, marginBottom: 10 }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View >
                            <Text style={{ fontSize: 20, color: '#2E2E2E', fontWeight: '700' }}>{type} Slip Logs</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        {
                            sort ?
                                <Feather
                                    name={"check-square"}
                                    size={35}
                                    style={{ color: 'black' }}
                                    onPress={handleSelect}
                                />
                                :
                                <Feather
                                    name={"square"}
                                    size={35}
                                    style={{ color: 'black' }}
                                    onPress={handleSelect}
                                />
                        }
                        <View style={{
                            width: 125,
                            backgroundColor: 'white',
                            borderColor: 'black',
                            borderRadius: 10,
                            borderWidth: 1,
                            height: 48,
                        }}>
                            <Picker
                                style={{
                                    color: 'black',
                                    fontWeight: '600',
                                }}
                                selectedValue={selectedOption4}
                                onValueChange={(itemValue: any) => setSelectedOption4(itemValue)}
                            >
                                <Picker.Item label="Created" value='' />
                                <Picker.Item label="Latest" value='Latest' />
                                <Picker.Item label="Oldest" value='Oldest' />
                            </Picker>
                        </View>
                        <View style={{
                            width: 125,
                            backgroundColor: 'white',
                            borderColor: 'black',
                            borderRadius: 10,
                            borderWidth: 1,
                            height: 48,
                        }}>
                            <Picker
                                style={{
                                    color: 'black',
                                    fontWeight: '600',
                                }}
                                selectedValue={selectedOption}
                                onValueChange={(itemValue: any) => setSelectedOption(itemValue)}
                            >
                                <Picker.Item label="Process" value='' />
                                {processName?.map((item: any, index: any) => (
                                    <Picker.Item
                                        label={item.processName}
                                        value={item.processName}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={styles.searchBarContainer}>
                            <Feather
                                name="search"
                                size={18}
                                color={'black'}
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by Process/Compo..."
                                onChangeText={text => setSearchQuery(text)}
                                value={searchQuery}
                                placeholderTextColor="gray"
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            {arr.length > 0 ?
                                <TouchableOpacity style={{ borderWidth: 1, width: '26%', paddingVertical: 13, borderRadius: 10, marginBottom: '2%', backgroundColor: '#FCECEC' }} disabled={timeElapsed} onPress={() => handleCancelPress()} >
                                    <Text style={{ alignSelf: 'center', color: '#8A2626' }}>Cancel</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity></TouchableOpacity>
                            }
                            {arr.length > 0 ?
                                <TouchableOpacity style={{ borderWidth: 1, width: '40%', paddingVertical: 13, borderRadius: 10, marginBottom: '2%', backgroundColor: '#bbf7d0' }} onPress={() => navigation.navigate('GenerateSlip', { arr, val: type })}>
                                    <Text style={{ alignSelf: 'center', color: '#15803d' }}>Generate</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity></TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ maxHeight: '78%', backgroundColor: 'white' }}>
                    {/* header */}
                    <View>
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({ item, index }) => (
                                console.log(item),
                                <View key={index} style={{ justifyContent: 'center', alignItems: 'center' }} >
                                    <TouchableOpacity key={item.id}>
                                        <View style={{ borderWidth: 1, borderColor: 'white', width: 350, marginBottom: responsiveHeight(2) }}>
                                            <View style={{ backgroundColor: '#F5F5F5', width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', flexDirection: 'row', padding: 20, justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'column', gap: 10, justifyContent: 'flex-start' }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 16 }}>
                                                            {item.finishItemName.length > 20
                                                                ? `${item.finishItemName.substring(0, 20)}...`
                                                                : item.finishItemName.trim()}
                                                        </Text>
                                                        {item.partId ? (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 70, textAlign: 'center' }}></Text>
                                                                <Checkbox.Android
                                                                    status={checked[item.productionSlip] ? "checked" : "unchecked"}
                                                                    onPress={() => toggelItem(item.productionSlip)}
                                                                />
                                                            </View>
                                                        ) : (
                                                            <Text>  </Text>
                                                        )}
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#757575', fontWeight: '500' }}>Part Name: {item.part}</Text>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>Process Name: {item.process.processName ? item.process.processName : item.process}</Text>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>Order Number: {item?.orderNumber}</Text>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>M Code: {item?.MCode}</Text>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>Part Code: {item?.partCode}</Text>
                                                    {item.contractBased ? (<Text>This is Contract Based Slip</Text>) : null}
                                                    {(item?.activatedAt) ?
                                                        (
                                                            <View>
                                                                <Text style={{ fontSize: 14, color: '#757575' }}>Time Elapsed: {calculateTimeElapsed(item?.activatedAt)}</Text>
                                                                <Text style={{ fontSize: 14, color: '#757575' }}>Active Time: {formatDateUTC(item?.activatedAt)}</Text>
                                                            </View>
                                                        )
                                                        :
                                                        (
                                                            null
                                                        )
                                                    }
                                                </View>
                                            </View>
                                            <View style={{ backgroundColor: '#ECEDFE', padding: 16, flexDirection: 'row', justifyContent: 'space-between', elevation: 2, borderBottomEndRadius: 40 }}>
                                                <TouchableOpacity onPress={() => handleDirectProduction(item?.productionSlip)} style={{ borderWidth: 1, borderRadius: 5, padding: 10, backgroundColor: '#283093' }}>
                                                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#FBFBFC' }}>{item?.productionSlip || " "}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', }} onPress={() => handlePress(item)}>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>View Mc/Emp</Text>
                                                    <Feather
                                                        name="chevron-right"
                                                        size={17}
                                                        color="#757575"
                                                        style={{ marginLeft: 2 }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </View>
            <Modal
                visible={modal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal2}
            >
                {mod ? (<Text>Loading....</Text>) :
                    (<View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Component Details</Text>
                            {upto && <FlatList
                                data={[upto]}
                                renderItem={({ item }: any) => (
                                    <View>
                                        {[
                                            { label: 'Activated By:', value: item.updates[0] },
                                            { label: 'Employees:', value: item.employeeNames.join(', ') },
                                            { label: 'Machines:', value: item.machineNames.join(', ') },
                                            { label: 'Part Name:', value: item.part },
                                            { label: 'Process Name:', value: item.process },
                                            { label: 'Time Elapsed:', value: calculateTimeElapsed(item.updates[1]) },
                                        ].map((info, index) => (
                                            <View key={index}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: index === 0 ? 0 : 10, color: '#000' }}>
                                                    {info.label}
                                                </Text>
                                                <Text style={{ fontSize: 14, color: '#000' }}>{info.value}</Text>
                                                {index < 5 && <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginVertical: 15 }}></View>}
                                            </View>
                                        ))}
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />}
                            <TouchableOpacity onPress={closeModal2} style={{ alignSelf: 'flex-end' }}>
                                <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>)
                }
            </Modal>
            <View>
                <Modal
                    visible={isModalProductionLogVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setIsModalProductionLogVisible(false)}
                >
                    <View style={styles.modalContainer1}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{t('Update your production')}</Text>
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
                                    /{item.itemProduced}
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
                                    style={[styles.okButton, produced.length === 0 ? styles.disabledButton : null]}
                                    onPress={() => handleCall(item)}
                                    disabled={produced.length === 0}
                                >
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}
export default CompletedSlips