import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Alert,
    DevSettings,
    ScrollView
} from 'react-native';
import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Feather from 'react-native-vector-icons/FontAwesome5';
import { useAuthContext } from '../../auth/AuthGuard';
import axios from 'axios';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { getPersonalAsync } from '../../redux/Slice/machineSlice';
import { useDispatch, useSelector } from 'react-redux';
import Clock from '../../components/Clock/Clock';
import { getNegativeAsync } from '../../redux/Slice/workOrderSlice';
import { useFocusEffect } from '@react-navigation/native';
import { useGetNegativeInventoryMutation } from '../../redux/features/apis2/Manufacturing';
import AnimatedLoader from '../../components/AnimatedLoader/AnimatedLoader';
import Tts from 'react-native-tts';
import Animation from '../../components/lottie/lottie';
const UserAccount = ({ navigation }: any) => {
    const auth: any = useAuthContext();
    const dispatch = useDispatch()
    console.log(auth?.authData?.jobProfileId?._id)
    useFocusEffect(() => {
        dispatch(getPersonalAsync())
    })
    const negative = useSelector((state: any) => state.workOrder.NegativeInventory.negativeTotal)
    console.log(negative)
    const [addNewPost, { data: negativeInventory, isError: negativeInventoryError, isLoading: negativeInventoryLoading }] = useGetNegativeInventoryMutation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                await addNewPost(auth?.authData?.jobProfileId?._id);
                handleSpeak();
            } catch (error) {
                // Handle the error appropriately (e.g., log it, show a user-friendly message)
                console.error("Error while adding new post:", error);
            }
        };
        fetchData();
    }, [auth?.authData?.jobProfileId?._id, negative]);

    const negativeTotal = negativeInventory?.cardData?.negativeTotal
    const handleSpeak = () => {
        if (negative !== null && negative !== undefined) {
            Tts.speak(`Aapka negative Inventory  hai ${negative}`);
        }
    }

    console.log(negativeInventory, negativeInventoryError, negativeInventoryLoading)
    const profile = useSelector((state: any) => state.machine.personalData)
    const pic = profile?.profilePicture || "https://miro.medium.com/v2/resize:fit:842/1*38QD8tbJ8z7Q4WyI9VC6QA.png";
    console.log(profile);
    const handleClearData = async () => {
        try {
            // Show a confirmation dialog to the user
            Alert.alert(
                'Reset App',
                'Are you sure you want to reset the app to its initial state?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Reset',
                        onPress: async () => {
                            // Clear AsyncStorage data
                            await AsyncStorage.clear();
                            // Restart the app
                            DevSettings.reload();
                        },
                    },
                ]
            );
        } catch (error) {
            // Handle errors
            console.error('Error resetting the app:', error);
        }
    };
    const handlePage = () => {
        navigation.navigate("dashboard");
    }
    const changeLanguage = (newLanguage: any) => {
        i18next.changeLanguage(newLanguage);
    };
    if (negativeInventoryLoading) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <View >
                <Image
                    source={{ uri: pic }}
                    style={{ width: '48%', height: '38%', borderRadius: 100, marginLeft: '25%', resizeMode: 'contain', }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: '1%', marginLeft: '5%' }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#000' }} >Name:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '100', color: '#000', textAlign: 'center', marginLeft: '2%', textDecorationLine: 'underline' }}>{profile?.employee?.name || profile?.admin?.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: '1%', marginLeft: '5%' }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#000' }} >Role:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '100', color: '#000', textAlign: 'center', marginLeft: '2%', textDecorationLine: 'underline' }}>{profile?.employee?.role || profile?.admin?.role}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: '1%', marginLeft: '5%' }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#000' }} >Email:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '100', color: '#000', textAlign: 'center', marginLeft: '2%', textDecorationLine: 'underline' }}>{profile?.employee?.email || profile?.admin?.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: '1%', marginLeft: '5%' }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#000' }} >Contact:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '100', color: '#000', textAlign: 'center', marginLeft: '2%', textDecorationLine: 'underline' }}>{profile?.employee?.contactNumber || profile?.admin?.contactNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: '1%', marginLeft: '5%' }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#000' }} >Negative Inventory:</Text>
                    <Text style={{ fontSize: 16, fontWeight: '100', color: '#000', textAlign: 'center', marginLeft: '2%', textDecorationLine: 'underline' }}>{negativeInventory?.cardData ? negativeInventory?.cardData?.negativeTotal : 0}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => handleClearData()}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <View style={{ marginLeft: '10%' }}>
                        <Feather name='dumpster-fire' size={29} color={'#283093'} style={{}} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.buttonText}>Clear Data (डेटा हटाएँ)</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton1} onPress={() => handlePage()}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <View style={{ marginLeft: '10%' }}>
                        <Feather name='unlock-alt' size={29} color={'#283093'} style={{}} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.buttonText1}>Edit Password (मुखपृष्ठ)</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton3} onPress={() => changeLanguage('hi')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <View style={{ marginLeft: '10%' }}>
                        <Feather name='language' size={29} color={'#283093'} style={{}} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.buttonText1}>Switch to Hindi (हिंदी) </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton5} onPress={() => changeLanguage('en')}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <View style={{ marginLeft: '10%' }}>
                        <Feather name='language' size={29} color={'#283093'} style={{}} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.buttonText1}>Switch to English (अंग्रेज़ी)</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton2} onPress={() => auth.actions.logout()}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <View style={{ marginLeft: '10%' }}>
                        <Feather name='sign-out-alt' size={29} color={'#283093'} style={{}} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.buttonText}>Logout (लॉग आउट)</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default UserAccount

const styles = StyleSheet.create({
    container: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        // backgroundColor: 'yellow',
        borderColor: '#D9D9D9',
        borderBottomWidth: 1,
    },
    loginButton: {
        borderBottomWidth: 1,
        justifyContent: 'center',

        marginTop: '-30%',
        height: '9%',
        borderRadius: 14,
        width: '100%',
    },
    loginButton1: {
        borderBottomWidth: 1,
        justifyContent: 'center',

        height: '7%',
        borderRadius: 14,
        width: '100%',
        margin: 5
    }, loginButton2: {
        borderBottomWidth: 1,
        justifyContent: 'center',

        height: '7%',
        borderRadius: 14,
        width: '100%',
        margin: 5
    }, loginButton3: {
        borderBottomWidth: 1,
        justifyContent: 'center',

        height: '7%',
        borderRadius: 14,
        width: '100%',
        margin: 5
    },
    loginButton5: {
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: '7%',
        borderRadius: 14,
        width: '100%',
        margin: 5
    },
    buttonText: {
        color: '#000',
    },
    buttonText1: {
        color: '#000',
    }, buttonText2: {
        color: '#000',
    }, buttonText3: {
        color: '#000',
    }, buttonText5: {
        color: '#000',
    },
    logo: {
        height: 25,
        marginLeft: 2,
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: Dimensions.get('window').height * 0.04,
        height: Dimensions.get('window').height * 0.04,
    },
    companyNameWrapper: {
        paddingHorizontal: Dimensions.get('window').width * 0.02,
    },
    companyName: {
        fontSize: Dimensions.get('window').height * 0.025,
        color: '#283093',
        fontWeight: '500',
    },
    profilePicture: {
        width: Dimensions.get('window').height * 0.04,
        height: Dimensions.get('window').height * 0.04,
        borderRadius: Dimensions.get('window').height * 0.02,
    },
    versionText: {
        fontSize: 16, // Customize the font size
        color: 'black', // Customize the text color
        // marginTop: 8, // Adjust the margin as needed
        marginLeft: responsiveWidth(-36),
    },
    versionTextWrapper: {
        alignItems: 'center', // Center the version text horizontally
        marginTop: responsiveHeight(5), // Adjust the margin as needed
    },
})