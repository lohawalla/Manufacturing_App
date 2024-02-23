import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const Clock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    return (
        <View style={styles.container}>
            <Text style={styles.timeText}>{timeString}</Text>
        </View>
    )
}

export default Clock

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Set your background color
    },
    timeText: {
        fontSize: 22,
        // fontWeight: 'bold',
        color: '#333', // Set your text color
    },
})