import React, { useState } from 'react';
import { View, Button } from 'react-native';
// @ts-ignore
import Voice from 'react-native-voice';

const VoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);

    const onSpeechStart = () => {
        // Speech recognition started
        setIsListening(true);
    };

    const onSpeechEnd = () => {
        // Speech recognition ended
        setIsListening(false);
    };

    const onSpeechResults = (e:any) => {
        // Handle the speech recognition results in e.value
        const transcript = e.value[0];
        // Implement search logic using the transcript
        console.log(transcript);
    };

    const startListening = async () => {
        try {
            await Voice.start('en-US');
        } catch (e) {
            console.error(e);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <View>
            <Button title="Start Listening" onPress={startListening} disabled={isListening} />
            <Button title="Stop Listening" onPress={stopListening} disabled={!isListening} />
        </View>
    );
};

export default VoiceSearch;
