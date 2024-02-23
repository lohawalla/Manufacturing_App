import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { ImageIndex } from '../../assets/AssetIndex';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { autoSelectSlipAsync, getRemainingQuantityAsync } from '../../redux/Slice/productionSlice';
import { getEmployeeAsync } from '../../redux/Slice/machineSlice';
const RunningSlip = ({ navigation }: any) => {
    const dispatch = useDispatch()
    const route = useRoute();
    const { ele, el }: any = route.params
    useEffect(() => {
        dispatch(autoSelectSlipAsync(el.productionSlipNumber))
        dispatch(getEmployeeAsync())
        dispatch(getRemainingQuantityAsync(el.productionSlipNumber))
    }, [])
    console.log("555555555555555555555555", ele, el);
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <View style={{ marginTop: 30, marginLeft: responsiveWidth(3) }}>
                <View style={{ flexDirection: 'row', }}>
                    <View>
                        <Text style={{ color: '#666666', fontWeight: '500' }}>WORK ORDER # {ele?.orderNumber}</Text>
                    </View>
                    <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        borderWidth: 2,
                        borderColor: 'black',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '25%',
                        display: 'flex', // Add display: 'flex' to the style
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: 14,
                            fontWeight: '600',
                            // Use absolute positioning
                        }}>
                            {el?.itemProduced}/{el?.numberOfItems}
                        </Text>
                            <Text style={{color: 'black',fontWeight: '600',fontSize: 12,}}>उत्पादित/कुल</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontSize: 21, fontWeight: '700', marginLeft: responsiveWidth(3) }}>{ele?.finishItemName}</Text>
                    <Text style={styles.TopText}>{ele?.orderQuantity} Items</Text>
                </View>
            </View>
            <View style={{ padding: 10, margin: 20 }}>
                <TouchableOpacity style={styles.InputText} onPress={() => navigation.navigate('EditAlotment', { ele, el })} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '7%', }}>
                        <Image style={{ width: responsiveWidth(8.6), height: responsiveHeight(3.75) }} source={ImageIndex.notePencil} />
                        <Text style={styles.TextStyle}>Edit Allotment (संपादन करे)</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.InputText, marginTop: 20 }} onPress={() => navigation.navigate('LogProduction', { ele, el })} >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '7%', }}>
                        <Image style={{ width: responsiveWidth(8.6), height: responsiveHeight(3.75) }} source={ImageIndex.clock} />
                        <Text style={styles.TextStyle}>Log Production (पर्ची बंद करे)</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default RunningSlip
const styles = StyleSheet.create({
    TopText: {
        marginLeft: responsiveWidth(62), color: '#666666', fontWeight: '500'
    },
    InputText: {
        width: '100%', height: '22%', marginTop: 10, borderRadius: 5, backgroundColor: '#ECEDFE'
    },
    TextStyle: { color: '#283093', fontWeight: '500', fontSize: 19, marginLeft: 10 }
})