import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activeCurrentSlipAsync } from '../../../redux/Slice/productionSlice';
import Feather from 'react-native-vector-icons/Feather';
import { BackHandler, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const CureentSlips = ({ navigation, id }: any) => {
    const [refreshing, setRefreshing] = useState(false);

    const singleWorkOrderList = useSelector((state: any) => state.workOrder.singleWorkOrders);
    console.log("hey check meee", id);
    let slipNumber;

    const dispatch = useDispatch();

    // useEffect(() => {
    //     const id = singleWorkOrderList?._id;
    //     dispatch(activeCurrentSlipAsync(id, "inactive"));
    // }, []);

    const activeCurrentSlip = useSelector((state: any) => state.production.activeCurrentSlips);
    console.log(activeCurrentSlip);
    const handleShare = () => {

    }
    const onRefresh = () => {
        setRefreshing(true);
        const id = singleWorkOrderList?._id;
        dispatch(activeCurrentSlipAsync(id, "inactive"));
        setRefreshing(false);
    };
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        // Clean up the event listener when the component unmounts
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const handleBackButton = () => {
        navigation.navigate("Work");    
        return true;
    };
    return (
        <ScrollView showsVerticalScrollIndicator={true} style={{ height: responsiveHeight(66) }} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}  />
        }>
            <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4, justifyContent: 'center',backgroundColor: 'white' }}>
                {activeCurrentSlip &&
                    activeCurrentSlip.map((item: any,index:number) => {
                        console.log(item)
                        const last2Digits = item?.status;
                        return (
                            <View key={index} style={{ borderWidth: 1, borderColor: 'white', borderRadius: 8, width: 300, marginBottom: responsiveHeight(2) }}>
                                <View style={{ backgroundColor: '#F5F5F5', width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', flexDirection: 'row', padding: 20, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'column', gap: 10 }}>
                                        <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 16 }}>
                                            {item?.part.partName}
                                        </Text>
                                        <Text style={{ fontSize: 14 }}>{item?.process.processName}</Text>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('GenerateSlip', { slipNumber: item.productionSlipNumber })}>
                                        <Feather
                                            name="share-2"
                                            size={17}
                                            color="#283093"
                                            style={{ marginRight: 5 }}
                                        />
                                        <Text style={{ fontSize: 16, color: '#283093', fontWeight: 'bold' }}>Share</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ backgroundColor: '#FAFAFA', padding: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: '500', color: '#757575' }}>{item?.productionSlipNumber}</Text>
                                    <Text>Status# {last2Digits}</Text>
                                </View>
                            </View>
                        );
                    })}
            </View>
        </ScrollView>
    );
};

export default CureentSlips;
