import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ImageIndex } from '../../assets/AssetIndex'
import Animation from '../lottie/lottie'
import { Color } from '../../screens/Dashboard/GlobalStyles'
import { useDispatch } from 'react-redux'
import { getRandomThoughtsAsync } from '../../redux/Slice/workOrderSlice'

const AnimatedLoader = () => {
    const [thought, setThought] = useState('')
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getRandomThoughtsAsync()).then((el: any) => {
            console.log("Hiiii", el);
            setThought(el?.payload?.quote)
        }).catch((err: any) => {
            console.log(err);
        });
    }, [])
    console.log(thought)
    return (
        <View style={{}} >
            <View style={{}}>
                <Image
                    style={{ width: '69%', height: '63%', alignSelf: 'center', resizeMode: 'contain' }}
                    source={ImageIndex.logo}
                />
                <Text style={{ color: '#283093', fontWeight: 'bold', textDecorationLine: 'underline', alignSelf: 'center', fontSize: 20 , marginTop: '-10%'}}>CHAWLA AUTO COMPONENTS</Text>
            </View>
            <Text style={{ color: '#000', fontWeight: 'bold', textDecorationLine: 'underline', alignSelf: 'center', fontSize: 20, marginTop: '35%' }}>
                Loading... | Version 3.0.55
            </Text>
            <Text style={{ color: '#283093', fontWeight: 'bold', alignSelf: 'center', fontSize: 15, marginTop: '0%', textDecorationLine: 'underline' }}>
                {thought}
            </Text>
            <ActivityIndicator color={Color.blueMainM500} size={30} />
            <Animation />
        </View>
    )
}

export default AnimatedLoader

const styles = StyleSheet.create({})