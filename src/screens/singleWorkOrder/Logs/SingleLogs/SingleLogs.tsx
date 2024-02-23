import { FlatList, StyleSheet, Text, View, ScrollView, BackHandler, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkOrderByChildPartByWorkOrderAsync } from '../../../../redux/Slice/workOrderSlice';
import Navbar from '../../../../components/Navbar/Navbar';
import { Card, DataTable } from 'react-native-paper';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';

const SingleLogs = ({ navigation }: any) => {
    const route = useRoute()
    const ele: any = route.params || {};
    const dispatch = useDispatch();
    const [r, setR] = useState(0);
    const [l, setLoading] = useState(false);
    const [modal, setModal] = useState<any>(false);
    const [detail, setDetail] = useState<any>('');
    let total = 0
    useEffect(() => {
        setLoading(true);
        setR(0);
        dispatch(getWorkOrderByChildPartByWorkOrderAsync(ele)).then((res: any) => {
            console.log(res);
            setLoading(false);
            if (res?.payload?.success == false) {
                console.warn(res.payload.message);
            }
        })
    }, [ele])
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const handleBackButton = () => {
        navigation.goBack();
        return true;
    };
    const logs = useSelector((state: any) => state.workOrder.WorkOrderByChildPartByWorkOrder)
    console.log(detail, logs, ele);
    if (l) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <Navbar />
            <View style={{ borderWidth: 1, borderRadius: 10, alignSelf: 'center', borderColor: '#283093' }}>
                <Text style={{ fontSize: 20, color: '#283093', fontWeight: '700', margin: 20 }}>{logs.partName}</Text>
            </View>
            <View style={{ marginTop: '5%', maxHeight: '65%', }} >
                <View>
                    <View style={{}}>
                        <FlatList
                            data={logs.data}
                            keyExtractor={item => item.id}
                            renderItem={({ item, index }: any) => (
                                console.log(item.itemCount),
                                total += item.itemCount,
                                setR(total),
                                console.log(total),
                                console.log(item),
                                <TouchableOpacity style={{ borderWidth: 1, width: '90%', alignSelf: 'center', borderRadius: 10, padding: 10, margin: 5 }} onPress={() => { setModal(true), setDetail(item) }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', margin: 5 }}>
                                        <View style={{ backgroundColor: item?.type === 'produced' ? '#E0F3EE' : '#FCECEC', borderRadius: 10, width: '30%', alignItems: 'center' }}>
                                            <Text style={{ color: item?.type === 'produced' ? '#005433' : '#E23F3F', fontFamily: 'Inter-Medium', alignItems: 'center' }}>
                                                {item?.type}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Text style={{ color: '#283093', fontSize: 13 }}>
                                                    Status:
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', alignItems: 'center', marginLeft: 5 }}>
                                                    {item?.status}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ margin: 5 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                            <View>
                                                <Text style={{ color: '#283093', fontSize: 18 }}>Slip Number:</Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', alignItems: 'center' }}>
                                                    {item?.productionSlipNumber}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center', margin: 5 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Text style={{ color: '#283093', fontSize: 13 }}>Date:</Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', marginLeft: 5 }}>{item?.completedTime.split("T")[0]}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View>
                                                <Text style={{ color: '#283093', fontSize: 13 }}>Count:</Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', marginLeft: 5, alignItems: 'center' }}>
                                                    {item?.itemCount}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', borderWidth: 1, width: '90%', alignSelf: 'center', borderRadius: 10, marginTop: '-5%', backgroundColor: 'white' }}>
                    <Text style={{ color: '#000', fontSize: 18 }}>Total:</Text>
                    <Text style={{ color: '#000' }}>{r}</Text>
                </View>
                <Modal
                    visible={modal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModal(false)}
                >
                    {!modal ? (<Text>Loading....</Text>) :
                        (<View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '95%' }}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Component Details:</Text>
                                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#000' }}>Activated By</Text>
                                    <Text numberOfLines={1} style={{ fontSize: 13, color: '#000' }}>
                                        {detail?.activatedBy?.name}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#000' }}>completed By:</Text>
                                    <Text numberOfLines={1} style={{ fontSize: 13, color: '#000' }}>
                                        {detail?.completedBy?.name}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setModal(false)} style={{ alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>)
                    }
                </Modal>
            </View>
        </View>
    )
}

export default SingleLogs

const styles = StyleSheet.create({
    columnHeaderText: {
        fontSize: 16,
        color: '#2E2E2E',
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#0000001F',
        backgroundColor: '#F5F5F5', // Alternating row colors
    },
    cellText: {
        fontSize: 14,
        color: '#2E2E2E',
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium',
    },
    tableCell: {
        flex: 1, // Distribute cell content evenly
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnHeader: {
        // width:100
    },
    mainbox: {
        textAlign: 'center',
        margin: 10,
        justifyContent: 'space-between',
        maxHeight: '70%',
    },
    searchBarContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        // marginBottom: '2%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        // marginTop: 10,
        borderWidth: 1,
        borderColor: '#DEDEDE',
        //   paddingVertical: '1%',
        marginLeft: '4%',
        //height:"10%"
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
    tableHeader: {
        backgroundColor: '#ECEDFE',
        flexDirection: 'row',
        // borderRadius: 8
    },
    tableData: {
        // paddingVertical: 10,
        paddingLeft: 20,
        width: 160,
        borderRadius: 8,
        height: 55,
        // borderBottomWidth:0.3,
        // width:80
    },
    tableDataH: {
        paddingVertical: 15,
        paddingLeft: 24,
        width: 160,
        // borderRadius: 8,  
        // width:50
    },
})