import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Modal, BackHandler } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { editProductionAsync, getSlipsOneDetailAsync } from '../../redux/Slice/workOrderSlice';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useTranslation } from 'react-i18next';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather1 from 'react-native-vector-icons/FontAwesome5';
import { totalSlipAsync } from '../../redux/Slice/productionSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from './styles';
import { useGetCountTotalSlipsQuery, useGetTotalSlipsQuery } from '../../redux/features/apis2/Manufacturing';
import { useAuthContext } from '../../auth/AuthGuard';
import { Checkbox } from 'react-native-paper';
const getTodayDate: any = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-based
    const day = today.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    return formattedDate;
};

const Completed = ({ navigation }: any) => {
    const [show, setShow] = useState(false);
    const auth: any = useAuthContext();
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState('');
    const [processName, setprocessName] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [modal, setModal] = useState<any>(false);
    const [info, setInfo] = useState([{}])
    const [upto, setUpto] = useState<any>();
    const [mod, setMod] = useState(false);
    const [checked, setChecked] = useState([]);
    const [produced, setProduced] = useState('');
    const [selected, setSelected] = useState(getTodayDate());
    const [isModalProductionLogVisible, setIsModalProductionLogVisible] = useState(false);
    const [item, setItem] = useState<any>([])
    const [sort, setSort] = useState(false);
    const dispatch = useDispatch();
    const complete = { completed: "completed", selected };
    const { data: completedSlips, isError: completedSlipsError, isSuccess: isCompletedSlipsSuccess, isFetching: completedSlipsFetching, refetch: completedSlipsRefetch } = useGetTotalSlipsQuery(complete, { refetchOnMountOrArgChange: true });
    const { data: loadingSlips, isError: loadingSlipsError, isSuccess: isLoadingSlipsSuccess, isFetching: loadingSlipsFetching, refetch: loadingSlipsRefetch } = useGetCountTotalSlipsQuery({ selected }, { refetchOnMountOrArgChange: true })
    const totalList = completedSlips && completedSlips.data;
    // console.log("current in inventory ------------------>", totalList)
    const completedCount = completedSlips && completedSlips.data.length;
    const completedData = completedSlips && completedSlips.data;
    console.log("current in inventoryonly ------------------>", completedSlips, loadingSlips, selected)
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
    for (const i in checked) {
        checked[i] == true ? arr.push(i) : "";
    }
    const handleConfirm = (date: any) => {
        const sendingDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        setSelected(sendingDate)
        setShow(false)
    }
    const handleSelect = () => {
        for (let i = 0; i < flatListData.length; i++) {
            console.log(flatListData[i])
            setChecked((prev: any) => ({
                ...prev,
                [flatListData[i].productionSlipNumber]: !prev[flatListData[i].productionSlipNumber]
            }))
        }
        setSort(!sort)
    }
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
                setSelected('');
            }
        });
    }
    const handleOKLog = (item: any) => {
        setIsModalProductionLogVisible(!isModalProductionLogVisible)
        setItem(item)
        console.log(item);
        console.log("ok pressed");
    }
    function isTimeWithin24Hours(endTime: any) {
        const endDateTime: any = new Date(endTime);
        console.log(endDateTime);
        const currentDateTime: any = new Date();
        console.log(currentDateTime);
        const timeDifference = currentDateTime - endDateTime;
        console.log(timeDifference);
        const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
        console.log(hoursDifference);
        return hoursDifference < 24;
    }
    const endTime = "2023-10-21T14:03:00.000Z";
    const isWithin24Hours = isTimeWithin24Hours(endTime);
    console.log(isWithin24Hours);
    const flatListData = completedSlips && completedSlips.data.map((item: any) => ({
        key: item._id,
        productionSlipNumber: item.productionSlipNumber,
        numberOfItems: item.numberOfItems ? item.numberOfItems : '',
        itemProduced: item.itemProduced,
        consumedItemPartName: 'N/A',
        process: item.process.processName ? item.process.processName : item.process,
        part: item.part.partName ? item.part.partName : item.part,
        employee: [],
        machines: [],
        finishItemName: item?.workOrderId?.finishItemName,
        endTime: (''),
        orderNumber: item?.workOrderId?.orderNumber
    }));
    console.log("item on completed slipp--->", flatListData);
    const searchData = (searchQuery: any) => {
        console.log(searchQuery,flatListData)
        if (!searchQuery) {
            return flatListData;
        }
        searchQuery = searchQuery.toLowerCase();
        return flatListData.filter((item: any) => {
            const part = item.part.toLowerCase();
            const process = item.process.toLowerCase();
            const orderNumber = item?.orderNumber.toLowerCase();
            const productionSlipNumber = item?.productionSlipNumber.toLowerCase();
            return part.includes(searchQuery) || process.includes(searchQuery) || orderNumber.includes(searchQuery) || productionSlipNumber.includes(searchQuery);
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
    const data2 = useSelector((item: any) => item.workOrder.SlipsDetail)
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
                    // Using the callback form to ensure the latest state
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
    }, [info, upto, mod]);
    useEffect(() => {
        fetchShop()
    }, [])
    const handleBackButton = () => {
        // Prevent default behavior (going back)
        navigation.navigate("dashboard");
        return true;
    };
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        // Clean up the event listener when the component unmounts
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const searchResults = selectedOption ? searchData(selectedOption) : searchData(searchQuery)
    if (completedSlipsFetching) {
        return <Spinner
            visible={completedSlipsFetching}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
        />;
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />
            <View style={{ flex: 1, marginBottom: 10 }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <View style={{ borderWidth: 1, padding: 10, borderRadius: 10, backgroundColor: '#E9F7EF' }}>
                            <Text style={{ color: '#000' }}>Total Loading Slips</Text>
                            <Text style={{ textAlign: 'center', color: '#1B7A43' }}>{loadingSlips?.loadingSlip}</Text>
                        </View>
                        <View style={{ borderWidth: 1, padding: 10, borderRadius: 10, backgroundColor: '#FCECEC' }}>
                            <Text style={{ color: '#000' }}>Scanned Loading Slips</Text>
                            <Text style={{ textAlign: 'center', color: '#E23F3F' }}>{loadingSlips?.totalSlipScanned}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                        <View >
                            <Text style={{ fontSize: 20, color: '#2E2E2E', fontWeight: '700' }}>Complete Slip</Text>
                        </View>
                        <View style={{
                            width: '41%',
                            backgroundColor: 'white',
                            borderColor: '#DEDEDE',
                            borderRadius: 10,
                            borderWidth: 1,
                            marginTop: 5
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
                        <DateTimePickerModal
                            isVisible={show}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={() => setShow(false)}
                        />
                        <View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }} onPress={() => setShow(!show)}>
                                <Feather1
                                    name="calendar-check"
                                    size={35}
                                    color={'black'}
                                />
                            </TouchableOpacity>
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
                        <View>
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
                        </View>
                        <View>
                            {arr.length > 0 ?
                                <TouchableOpacity style={{ borderWidth: 1, padding: 15, borderRadius: 10, marginBottom: '2%', backgroundColor: '#bbf7d0' }} onPress={() => navigation.navigate('GenerateSlip', { arr, val: "Completed" })}>
                                    <Text style={{ alignSelf: 'center', color: '#15803d' }}>Generate</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity></TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ maxHeight: '72%', backgroundColor: 'white', }}>
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
                                                        {true ? (
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Text style={{ marginRight: 70, textAlign: 'center' }}></Text>
                                                                <Checkbox.Android
                                                                    status={checked[item.productionSlipNumber] ? "checked" : "unchecked"}
                                                                    onPress={() => toggelItem(item.productionSlipNumber)}
                                                                />
                                                            </View>
                                                        ) : (
                                                            <Text>  </Text>
                                                        )}
                                                    </View>
                                                    <Text style={{ fontSize: 14, color: '#757575', fontWeight: '500' }}>Part Name: {item.part}</Text>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>Process Name: {item.process.processName ? item.process.processName : item.process}</Text>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>Produced Items: {item.itemProduced}</Text>
                                                    <Text style={{ fontSize: 14, color: '#757575' }}>Order Number: {item?.orderNumber}</Text>
                                                    <Text style={{ fontSize: 15, color: '#000' }}>Current Date: {selected}</Text>
                                                </View>
                                            </View>
                                            <View style={{ backgroundColor: '#ECEDFE', padding: 16, flexDirection: 'row', justifyContent: 'space-between', elevation: 2, borderBottomEndRadius: 40 }}>
                                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 5, padding: 10, backgroundColor: '#283093' }}>
                                                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#FBFBFC' }}>{item?.productionSlipNumber || ""}</Text>
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

export default Completed

