import AsyncStorage from '@react-native-async-storage/async-storage';

export const deleteKeysFromAsyncStorage = async (keys:any) => {
    try {
        await AsyncStorage.multiRemove(keys);
        return (`Deleted keys from AsyncStorage: ${keys.join(', ')}`);
    } catch (error) {
        console.error('Error deleting keys from AsyncStorage:', error);
    }
};
