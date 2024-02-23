import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CustomDrawerContent = ({ navigation }:any) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                <Text>Close Drawer</Text>
            </TouchableOpacity>
            {/* Add your drawer items here */}
            <TouchableOpacity onPress={() => navigation.navigate('Machine')}>
                <Text>Machine</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Employees')}>
                <Text>Employees</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CustomDrawerContent;
