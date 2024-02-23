import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import LottieView from 'lottie-react-native';

const CustomFallback = (props: { error: Error, resetError: any }) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            props.resetError();
        }, 10000); 
        return () => clearTimeout(timeoutId);
    }, [props.resetError]);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Something went wrong!</Text>
            <LottieView source={require('../../assets/lottie2.json')} autoPlay loop style={{ borderRadius: 50 }} />
            <View style={{ marginTop: '90%' }}>
                <View style={{}}>
                    <Text style={styles.errorText}>{props.error.toString()}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={props.resetError}>
                    <Text style={styles.buttonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    errorText: {
        fontSize: 16,
        marginBottom: 20,
        color: '#f5f5f5',
        backgroundColor: '#059669',
        borderRadius: 5
    },
    button: {
        backgroundColor: '#14b8a6',
        padding: 15,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

export default CustomFallback;
