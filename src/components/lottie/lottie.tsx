import React from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';

export default function Animation() {
    return (
        <LottieView source={require('../../assets/lottie.json')} autoPlay loop style={{ marginTop: '15%' }} />
    );
}