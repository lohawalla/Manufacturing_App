import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { responsiveHeight } from 'react-native-responsive-dimensions'
import { Image } from 'react-native'
import { ImageIndex } from '../../assets/AssetIndex'
import { ProgressBar } from 'react-native-paper'
import { Color } from '../../screens/Dashboard/GlobalStyles'

const Loading = ({progress}:any) => {
    return (
        <View style={{ marginTop: responsiveHeight(10) }}>
            <View>
                <Image
                    style={{ width: '79%', height: '73%', alignSelf: 'center' }}
                    source={ImageIndex.logo}
                />
                <Text style={{ color: '#283093', fontWeight: 'bold', textDecorationLine: 'underline', alignSelf: 'center', fontSize: 20 }}>CHAWLA AUTO COMPONENTS</Text>
            </View>
            <ProgressBar progress={progress} color={Color.blueMainM500} style={{ height: 15, width: '95%', backgroundColor: '#E0E0E0', borderRadius: 5, alignSelf: 'center' }} />
        </View>
    ) 
}

export default Loading

const styles = StyleSheet.create({})