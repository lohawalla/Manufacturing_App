import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';

const CustomCard = ({ name, active, inActive, navigation }: any) => {
    return (
        <TouchableOpacity style={{ borderWidth: 1, width: 168, height: 129, backgroundColor: '#ECEDFE52', alignItems: 'center', justifyContent: 'center', borderColor: '#ECEDFE52', borderRadius: 2, elevation: 0.1 }} onPress={() => navigation.navigate(`${name}`)}>
            <Feather
                name={name=="Employees"?"users":"settings"}
                color={'black'}
                size={40}
                style={{ marginLeft: 5, color: '#283093' }}
            />
            <Text style={{ color: '#283093', marginTop: 10, }}> {name}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#283093', marginTop: 10, }}> Active: {active ? active?.length : ""} </Text>
                <Text style={{ color: '#283093', marginTop: 10, }}> Inactive: {inActive ? inActive?.length : ""}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CustomCard

const styles = StyleSheet.create({})