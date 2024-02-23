import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Modal as Modal1, Modal as Modal2, Image, BackHandler, Alert, TextInput } from 'react-native'
import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react'
import { activeCurrentLogsAsync } from '../../../redux/Slice/productionSlice';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { ImageIndex } from '../../../assets/AssetIndex';
import { Picker } from '@react-native-picker/picker';
import { generateProductionSlipAsync } from '../../../redux/Slice/productionSlice'
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { Checkbox } from 'react-native-paper';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import { manipulateData } from './function';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { usePostActiveLogsMutation, usePostChildPartOrderMutation } from '../../../redux/features/apis2/Manufacturing';
import { ActivityIndicator } from 'react-native';

const Logs = ({ id, navigation, uniqueProcess }: any) => {
    const [isModalVisible1, setModalVisible1] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedWorkItem, setSelectedWorkItem] = useState<any>(null);
    const [isModalVisible, setModalVisible] = useState(false)
    const [isModalVisible2, setModalVisible2] = useState(false)
    const [selectedWorkItem2, setSelectedWorkItem2] = useState<any>(null)
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptionI, setSelectedOptionI] = useState('');
    const [selectedOption3, setSelectedOption3] = useState('');
    const [selectedOption4, setSelectedOption4] = useState('');
    const [sortedData, setSortedData] = useState<any>([]);
    const [checked, setChecked] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [id1, setId1] = useState(null);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const [endDateTime, setEndDateTime] = useState(`${year}-${month}-${day}`)
    console.log(year, month, day);
    const [postForm, setPostForm] = useState<any>({
        childPartId: null,
        endTime: `${year}-${month}-${day}`,
        itemProduced: 0,
        remark: '',
        startTime: `${year}-${month}-${day}`,
        workOrderId: null
    })
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    console.log("selecteditem on modal", selectedItem)
    console.log("workempppp", selectedWorkItem)
    console.log("iddddddddddddddddd", id)
    const hideModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };
    const closeModal = () => {
        setModalVisible(false);
        setSelectedWorkItem(null);
    };
    const closeModal2 = () => {
        setModalVisible2(false);
        setSelectedWorkItem2(null);
    };
    const closeModal1 = () => {
        setModalVisible1(false);
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const [addActivePost, { data: addActivePostData, isError: addActivePostError, isLoading: addActivePostLoading }] = usePostActiveLogsMutation();
    console.log(addActivePostData, addActivePostError, addActivePostLoading)
    const handleConfirm3 = (date: any) => {
        const sendingDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        setEndDateTime(sendingDate)
        setPostForm({ ...postForm, endTime: sendingDate, startTime: sendingDate, workOrderId: id, childPartId: id1 });
        console.log(sendingDate);
        setDatePickerVisibility(false);
    }
    const dispatch = useDispatch();
    useEffect(() => {
        const data = { id, selectedOption, selectedOption3, selectedOption4 }
        const fetchData = async () => {
            const { result } = await addActivePost(data).unwrap();
            console.log(result);
            setSortedData(result?.resultWithPlanning)
        }
        console.log("checking id changes with process", id, selectedOption)
        setLoading(true);
        dispatch(activeCurrentLogsAsync(data)).then((result: any) => {
            console.log('Dispatch successful:', result);
        })
            .catch((error: any) => {
                console.error('Dispatch error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        fetchData();
    }, [selectedOption, selectedOption3, selectedOption4, navigation, id, selectAll]);
    useEffect(() => {
        const data = { id, selectedOption, selectedOption3, selectedOption4 }
        addActivePost(data)
    }, [id, selectAll])
    const activeCurrentlogsss: any = addActivePostData && addActivePostData.result && addActivePostData.result?.resultWithPlanning || [];
    console.log('hardwareBackPress', activeCurrentlogsss, selectAll);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const handleBackButton = () => {
        navigation.navigate("Work");
        return true;
    };
    const ids = activeCurrentlogsss.map((el: any) => {
        if (el.partId) {
            return el.partId;
        }
        return null;
    });
    console.log(ids);
    const toggelItem = (id: any) => {
        setChecked((prev: any) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }
    const trueIds = Object.entries(checked)
        .filter(([id, value]) => value === true)
        .map(([id]) => id);
    useEffect(() => {
        manipulateData(sortedData, selectedOptionI, searchQuery);
    }, [selectedOptionI, searchQuery, selectAll]);
    const [addNewPostNegative, { data: negativeInventory, isError: negativeInventoryError, isLoading: negativeInventoryLoading }] = usePostChildPartOrderMutation();
    console.log(negativeInventory, negativeInventoryError, negativeInventoryLoading);
    const handlePressSubmit = async () => {
        console.log(postForm);
        try {
            const result = await addNewPostNegative(postForm).unwrap();
            console.log('Success:', result);
            if (result.success == true) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: result.message,
                    button: 'close',
                })
                setSelectAll((prev) => prev + 1)
                setModalVisible1(false);
                setPostForm({
                    childPartId: null,
                    endTime: `${year}-${month}-${day}`,
                    itemProduced: 0,
                    remark: '',
                    startTime: `${year}-${month}-${day}`,
                    workOrderId: null
                })
                setId1(null)
                setEndDateTime(`${year}-${month}-${day}`)
            } else {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Failed",
                    textBody: result.message,
                    button: 'close',
                })
                const data = { id, selectedOption, selectedOption3, selectedOption4 }
                addActivePost(data)
                setModalVisible1(false);
                setPostForm({
                    childPartId: null,
                    endTime: `${year}-${month}-${day}`,
                    itemProduced: 0,
                    remark: '',
                    startTime: `${year}-${month}-${day}`,
                    workOrderId: null
                })
                setId1(null)
                setEndDateTime(`${year}-${month}-${day}`)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const handleSlipGeneration = () => {
        const uniData = {
            workOrderId: id,
            childPartIds: trueIds.length > 0 ? trueIds : ids
        };
        console.log("UNiversal Data on logss", uniData);
        setLoading(true);
        dispatch(generateProductionSlipAsync(uniData))
            .then((response: any) => {
                console.log("API call succeeded:", response?.payload?.success, response);
                let msg
                (response?.payload?.success) ? msg = 'SUCCESS' : msg = 'DANGER'
                if (msg == "SUCCESS") {
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: msg,
                        textBody: response.payload.message,
                        button: 'close',
                    })
                } else {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: msg,
                        textBody: response.payload.message,
                        button: 'close',
                    })
                }
                setLoading(false);
                navigation.navigate('dashboard');
            })
            .catch((error: any) => {
                console.error("API call failed:", error);
                setLoading(false);
                navigation.navigate('dashboard');
            });
    }
    if (addActivePostLoading) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View>
            <View style={{ backgroundColor: 'white', height: responsiveHeight(66) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '2%' }}>
                    <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={{
                            flexDirection: 'row', // To align content horizontally
                            justifyContent: 'space-between', // To evenly space the pickers
                            paddingHorizontal: 10, // Add horizontal padding for better visualization
                        }}>
                            <View style={{
                                width: 140, // Set a fixed width for each picker
                                backgroundColor: 'white',
                                borderColor: '#DEDEDE',
                                borderRadius: 10,
                                borderWidth: 1,
                                marginRight: 10, // Add margin between pickers for better visualization
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
                                    {uniqueProcess?.map((item: any, index: any) => (
                                        <Picker.Item
                                            key={index}
                                            label={item}
                                            value={item}
                                        />
                                    ))}
                                </Picker>
                            </View>
                            <View style={{
                                width: 140, // Set a fixed width for each picker
                                backgroundColor: 'white',
                                borderColor: '#DEDEDE',
                                borderRadius: 10,
                                borderWidth: 1,
                                marginRight: 10, // Add margin between pickers for better visualization
                            }}>
                                <Picker
                                    style={{
                                        color: 'black',
                                        fontWeight: '600',
                                    }}
                                    selectedValue={selectedOptionI}
                                    onValueChange={(itemValue: any) => setSelectedOptionI(itemValue)}
                                >
                                    <Picker.Item label="SORT" value='' />
                                    <Picker.Item label="Largest-Smallest" value='max' />
                                    <Picker.Item label="Smallest-Largest" value='min' />
                                </Picker>
                            </View>
                            <View style={{
                                width: 250,
                                backgroundColor: 'white',
                                borderColor: '#DEDEDE',
                                borderRadius: 10,
                                borderWidth: 1,
                                marginRight: 10,
                            }}>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search by Process/Compo..."
                                    onChangeText={text => setSearchQuery(text)}
                                    value={searchQuery}
                                    placeholderTextColor="gray"
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <FlatList
                    data={manipulateData(sortedData, selectedOptionI, searchQuery || selectedOption)}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }: any) => (
                        console.log(item),
                        <View key={index + Math.random()} className="flex-col items-center gap-1 justify-center my-1">
                            <View className="border border-solid border-white rounded-md w-80">
                                <View className="bg-[#F5F5F5] w-full  border-b  rounded-sm border-[#F5F5F5] flex-row p-7 justify-between" >
                                    <View className="flex-col gap-1">
                                        <Text className="text-[#4A4A4A] font-medium text-base" style={{}}>
                                            {item?.partName && item.partName.length > 20
                                                ? `${item.partName.slice(0, 20)}...`
                                                : item?.partName}
                                        </Text>
                                        <Text className="text-sm font-normal">
                                            {item?.process}
                                        </Text>
                                        <View>
                                            <Text style={{ color: '#283093', fontWeight: '500', fontSize: 15 }}>Pending Req: {item.numberOfItems - item?.itemProduced}</Text>
                                            <Text style={{ color: '#283093', fontWeight: '500', fontSize: 15 }}>Planning Req: {item?.planningRequirement}</Text>
                                            <TouchableOpacity style={{ backgroundColor: item.inventory > 0 ? '#283093' : '#f87171', paddingVertical: 8, borderRadius: 5, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 5 }} onPress={() => navigation.navigate('SingleLogs', { workOrderId: id, partId: item.partId })}>
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 15, marginLeft: 10 }}>Inventory: {item?.inventory !== null ? item?.inventory : 0}</Text>
                                                <Feather
                                                    name={"arrow-right"}
                                                    size={20}
                                                    color={'white'}
                                                    style={{ marginRight: 5, }}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ backgroundColor: '#283093', paddingVertical: 8, borderRadius: 5, width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 5 }} onPress={() => { setId1(item.partId), setModalVisible1(true), setPostForm({ ...postForm, workOrderId: id, childPartId: item.partId }) }}>
                                                <Text style={{ color: 'white', fontWeight: '500', fontSize: 15, marginLeft: 10 }}>Add Past Production</Text>
                                                <Feather
                                                    name={"arrow-right"}
                                                    size={20}
                                                    color={'white'}
                                                    style={{ marginRight: 5, }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'column', marginLeft: '2%', }}>
                                        {(item && item.partId) ?
                                            (<Checkbox.Android
                                                status={
                                                    item &&
                                                        item.partId &&
                                                        checked[item.partId] ? "checked" : "unchecked"
                                                }
                                                onPress={() => toggelItem(item.partId)}
                                            />)
                                            :
                                            (<Text>  </Text>)
                                        }
                                        <TouchableOpacity style={{ marginTop: 15 }} className="flex-row items-center text-center justify-center " onPress={() => { setSelectedItem(item), setShowModal(true); }}>
                                            <Text style={{ fontWeight: '500', color: '#949494' }}>{item?.numberOfProductionSlips} Slips</Text>
                                            <Feather
                                                name={"chevron-right"}
                                                size={17}
                                                color={'#949494'}
                                                style={{ marginLeft: 0.2 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View className="bg-[#FAFAFA] px-2 py-4 w-full  flex-row justify-between">
                                    {(item?.productionSlipNumbers) ? (
                                        <View className='flex-row'>
                                            <Feather name='check' size={17} color={'#186A3B'} style={{ marginRight: 2 }} />
                                            <Text style={{ color: '#283093', fontWeight: '500', marginLeft: 10 }}>
                                                Active {item?.productionSlipNumbers?.filter((slip: any) => slip?.status === 'active').length}
                                            </Text>
                                            <Text style={{ color: '#f87171', fontWeight: '500', marginLeft: 10 }}>
                                                InActive {item?.productionSlipNumbers?.filter((slip: any) => slip?.status === 'inactive').length}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View className='flex-row'>
                                            <Feather name='loader' size={17} color={'#f87171'} style={{ marginRight: 2 }} />
                                            <Text style={{ color: '#f87171', fontWeight: '500' }}>
                                                InActive
                                            </Text>
                                        </View>
                                    )}
                                    <Text >{`${item.itemProduced} / ${item.numberOfItems}`}</Text>
                                </View>
                            </View>
                        </View>
                    )} />
                <Modal1
                    visible={isModalVisible1}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible1(false)}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: '90%', paddingHorizontal: 20, borderWidth: 1 }}>
                            <Feather
                                name={"x"}
                                size={34}
                                color={'#949494'}
                                style={{ position: 'absolute', top: 10, right: 10 }}
                                onPress={() => setModalVisible1(false)}
                            />
                            <View style={{ marginVertical: 20 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                                    <View style={{ borderWidth: 2, padding: 10, borderRadius: 10 }}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#283093' }}>Add Past Production</Text>
                                    </View>
                                </View>
                                {/* Quantity Produced */}
                                <View style={{ marginBottom: 20, width: '90%' }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Quantity Produced:</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            borderRadius: 5,
                                            padding: 12,
                                            fontSize: 16,
                                        }}
                                        onChangeText={(e) => setPostForm({ ...postForm, itemProduced: +e })}
                                        value={postForm.itemProduced.toString()}
                                        onFocus={() => setPostForm({ ...postForm, itemProduced: '' })}
                                        placeholder="Enter quantity"
                                        keyboardType="numeric"
                                    />
                                </View>
                                {/* Remark */}
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Remark:</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            borderRadius: 5,
                                            padding: 12,
                                            fontSize: 16,
                                        }}
                                        onChangeText={(e) => setPostForm({ ...postForm, remark: e })}
                                        value={postForm.remark}
                                        placeholder="Enter remark"
                                    />
                                </View>
                                {/* Date Selection */}
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Date: {endDateTime}</Text>
                                    <TouchableOpacity
                                        onPress={() => setDatePickerVisibility(true)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#283093',
                                            borderRadius: 5,
                                            padding: 12,
                                            marginTop: 10,
                                            backgroundColor: '#283093',
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 16 }}>Select Date</Text>
                                    </TouchableOpacity>
                                </View>
                                {isDatePickerVisible && (
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleConfirm3}
                                        onCancel={hideDatePicker}
                                    />
                                )}
                            </View>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 2,
                                    padding: 14,
                                    borderRadius: 10,
                                    marginVertical: 20,
                                    backgroundColor: '#283093',
                                }}
                                onPress={handlePressSubmit}
                            >
                                {negativeInventoryLoading ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text style={{ fontSize: 18, color: 'white', textAlign: 'center' }}>Activate</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal1>
                <Modal isVisible={showModal} animationInTiming={600} style={styles.modal} onBackdropPress={hideModal}
                    onBackButtonPress={hideModal} >
                    <View style={[styles.modalContainer, { height: '80%' }]}>
                        {selectedItem &&
                            <View>
                                <View className='flex-row  text-center justify-between mx-10 '>
                                    <View className="flex-col gap-1 ">
                                        <Text className="text-[#4A4A4A] font-medium text-lg">
                                            {selectedItem?.partName}{' '}
                                        </Text>
                                        <Text className="text-sm font-normal">
                                            {selectedItem?.process}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center text-center justify-center" >
                                        <Text style={{ fontWeight: '500', color: '#949494' }}>{selectedItem?.numberOfProductionSlips} Slips</Text>
                                    </View>
                                </View>
                                <View style={{ maxHeight: responsiveHeight(73) }}>
                                    <FlatList
                                        data={selectedItem.productionSlips}
                                        renderItem={
                                            (
                                                { item }: any) => (
                                                console.log("iteminside productionslip ", item?.working[0]),
                                                <View className='border border-solid border-[#DEDEDE] rounded-lg w-80 mx-5 my-3'>
                                                    {/* <Text>{item._id}</Text> */}
                                                    <View className='flex-col p-5'>
                                                        <View className='flex-row' style={{ alignItems: 'center' }}>
                                                            <Feather name='package' size={18}
                                                                color={'white'}
                                                                style={{ borderRadius: 18, backgroundColor: '#283093', padding: 9 }}
                                                            />
                                                            <Text style={{ fontWeight: '600', fontSize: 18, marginLeft: '5%' }}>{item?.itemProduced} Items Produced</Text>
                                                        </View>
                                                        {/* <Text>date</Text> */}
                                                        <View>
                                                            {item.working.map((workItem: any, index: number) => (
                                                                <View key={index} style={{ flexDirection: 'row', margin: '6%' }}>
                                                                    <TouchableOpacity onPress={() => {
                                                                        setSelectedWorkItem(workItem);
                                                                        setModalVisible(true);
                                                                    }}>
                                                                        <Text style={{ textDecorationLine: 'underline', fontWeight: '600', fontSize: 18 }}> {workItem.employees.length} Employees</Text>
                                                                    </TouchableOpacity>
                                                                    <Text style={{ marginLeft: '4%', marginRight: '4%', fontWeight: '600', fontSize: 18 }}>&</Text>
                                                                    <TouchableOpacity onPress={() => {
                                                                        setSelectedWorkItem2(workItem);
                                                                        setModalVisible2(true);
                                                                    }}>
                                                                        <Text style={{ textDecorationLine: 'underline', fontWeight: '600', fontSize: 18 }}>{workItem.machines.length} Machines</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            ))}
                                                        </View>
                                                    </View>
                                                    <View className='w-full bg-[#FAFAFA]' style={{ borderRadius: 9, borderTopLeftRadius: 2, borderTopRightRadius: 2 }}>
                                                        <Text className='mx-4 my-2'>{item.productionSlipNumber}</Text>
                                                    </View>
                                                </View>
                                            )
                                        } />
                                </View>
                            </View>
                        }
                    </View >
                </Modal >
                <Modal1
                    visible={isModalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal} >
                    <View style={{ width: '80%', height: responsiveHeight(52), backgroundColor: 'white', marginTop: '80%', borderWidth: 0.2, elevation: 9, padding: '3%', marginLeft: '10%', marginRight: '5%' }}>
                        <Feather
                            name={"x"}
                            size={20}
                            color={'#949494'}
                            style={{ marginLeft: '90%' }}
                            onPress={closeModal}
                        />
                        <View >
                            <Text style={{ color: '#2E2E2E', fontWeight: '700', fontSize: 20 }}> Employees - {selectedWorkItem?.employees.length}</Text>
                            <ScrollView style={{ maxHeight: responsiveHeight(45) }}>
                                {selectedWorkItem?.employees.map((employee: any, index: any) => (
                                    <View className='flex-row' style={{ alignItems: 'center' }}>
                                        <Image style={{ marginTop: '5%', marginLeft: '4%' }} source={ImageIndex.employ} />
                                        <Text style={{ marginTop: '5%', marginLeft: '5%' }} key={index}>{employee.employeeName}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal1>
                <Modal2
                    visible={isModalVisible2}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal2} >
                    <View style={{ width: '80%', height: '50%', backgroundColor: 'white', marginTop: '80%', borderWidth: 0.2, elevation: 9, padding: '3%', marginLeft: '10%', marginRight: '5%' }}>
                        <Feather
                            name={"x"}
                            size={20}
                            color={'#949494'}
                            style={{ marginLeft: '90%' }}
                            onPress={closeModal2}
                        />
                        <View>
                            <Text style={{ color: '#2E2E2E', fontWeight: '700', fontSize: 20 }}> Machine - {selectedWorkItem2?.machines.length}</Text>
                            <ScrollView>
                                {selectedWorkItem2?.machines.map((machine: any, index: any) => (
                                    <View className='flex-row text-center ' style={{ alignItems: 'center' }}>
                                        <Image style={{ marginTop: '5%', marginLeft: '5%', }} source={ImageIndex.diamond} />
                                        <Text style={{ marginTop: '5%', marginLeft: '4%' }} key={index}>{machine.machineName}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal2>
            </View >
            {trueIds.length > 0 ? (
                <TouchableOpacity style={styles.loginButton} onPress={() => handleSlipGeneration()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Feather
                            name={"plus"}
                            size={25}
                            color={'black'}
                            style={{ marginLeft: 2, color: "white" }}
                        />
                        <Text style={[styles.buttonText]}>Generate</Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{trueIds.length}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.loginButton1} onPress={() => handleSlipGeneration()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Feather
                            name={"check"}
                            size={25}
                            color={'black'}
                            style={{ marginLeft: 2, color: "white" }}
                        />
                        <Text style={[styles.buttonText]}>All Selected</Text>
                    </View>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{ids[0] != null ? ids.length : 0}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View >
    )
}
export default Logs
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
        // flex: 1
    },
    modalContainer: {
        backgroundColor: 'white',
        // paddingHorizontal: 16,
        paddingTop: 20,
        // alignItems: 'center',
        borderRadius: 10
    },
    loginButton: {
        backgroundColor: '#283093',
        justifyContent: 'center',
        alignItems: 'center',
        height: responsiveHeight(9),
        borderRadius: 14,
        marginTop: responsiveHeight(48),
        width: responsiveWidth(35),
        position: 'absolute',
        marginLeft: '55%',
    },
    loginButton1: {
        backgroundColor: '#8A2626',
        justifyContent: 'center',
        alignItems: 'center',
        height: responsiveHeight(9),
        borderRadius: 14,
        marginTop: responsiveHeight(48),
        width: responsiveWidth(35),
        position: 'absolute',
        marginLeft: '55%',
    },
    buttonText: {
        color: 'white',
        paddingLeft: responsiveWidth(2),
        fontSize: 17
    },
    badgeContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 12, // Adjust as needed for the desired shape
        paddingHorizontal: 8, // Add horizontal padding to give some space around the content
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 25, // Set a minimum width to ensure it's not too small
        minHeight: 25, // Set a minimum height to ensure it's not too small
    },
    badgeText: {
        color: 'white',
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
        color: '#333',
    },
    searchInput: {
        fontSize: 16,
        height: 48,
        flex: 1,
        color: 'black'
    },
    searchBarContainer: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        zIndex: 999,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '92%',
        marginTop: 20, // Adjust as needed
        borderWidth: 1,
        borderColor: '#DEDEDE',
        marginLeft: '4%',
    },
})