// In your main App component or a dedicated LanguageSwitch component
import React from 'react';
import { View, Button } from 'react-native';
import i18next from 'i18next';

const LanguageSwitch = ({navigation}:any) => {
    const changeLanguage = (newLanguage:any) => {
        i18next.changeLanguage(newLanguage);
    };

    return (
        <View>
            <Button
                title="Switch to Hindi"
                onPress={() => {
                    changeLanguage('hi'); // Change language to Hindi
                    navigation.navigate('dashboard'); // Navigate to the same screen (refresh)
                  }} // Change language to Hindi
            />
            <Button
                title="Switch to English"
                onPress={() => {
                    changeLanguage('en'); // Change language to English or any other supported language
                    navigation.navigate('dashboard'); // Navigate to the same screen (refresh)
                  }} // Change language to English or any other supported language
            />
            {/* Add buttons for other languages as needed */}
        </View>
    );
};

export default LanguageSwitch;
