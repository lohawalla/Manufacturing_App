import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Alert,
    DevSettings,
    StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react'
import { ImageIndex } from '../../assets/AssetIndex';
import { useAuthContext } from '../../auth/AuthGuard';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, BackHandler, Linking } from 'react-native';
import Feather from 'react-native-vector-icons/FontAwesome5';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { useGetProfilePictureQuery, useGetTotalSlipsQuery } from '../../redux/features/apis2/Manufacturing';
export default function Navbar({ navigation, active }: any) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    const [show, setShow] = useState(false);
    const selected = '';
    const { data: profilePic, isError: profilePicError, isSuccess: isProfilePicSuccess, isFetching: profilePicFetching, refetch: profilePicRefetch } = useGetProfilePictureQuery({});
    // const { data: activeSlips, isError: ActiveSlipsError, isSuccess: isActiveSlipsSuccess, isFetching: ActiveSlipsFetching, refetch: ActiveSlipsRefetch } = useGetTotalSlipsQuery("active", { refetchOnMountOrArgChange: true })
    console.log(profilePic, profilePicError, isProfilePicSuccess, profilePicFetching, profilePicture);
    const auth: any = useAuthContext();
    useEffect(() => {
        profilePicRefetch();
    }, [auth?.authData?._id])
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        console.log('im clicked ');
    };
    const activeCount = active
    const handleLogOut = () => {
        const token = Cookies.get('token');
        console.log('Current token:', token);
        if (activeCount > 0) {
            Alert.alert(
                'Logout', `Are you sure you want to Logout.Your Active Slips are ${activeCount}`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: () => {
                            auth.actions.logout();
                            AsyncStorage.clear();
                            Cookies.remove('token', { path: 'https://chawlacomponents.com' })
                            console.log('Token removed');
                            console.log('Current token:', token);
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            auth.actions.logout();
            AsyncStorage.clear();
            Cookies.remove('token', { path: 'https://chawlacomponents.com' })
        }
    };
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
        setModalVisible(false);
    };
    const handlePage = () => {
        navigation.navigate("dashboard");
        setModalVisible(false);
    }
    const changeLanguage = (newLanguage: any) => {
        i18next.changeLanguage(newLanguage);
        setModalVisible(false);
    };
    return (
        <View >
            <StatusBar
                backgroundColor="#fafafa"
                barStyle="dark-content"
            />
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={styles.logoWrapper}>
                        <Image
                            style={styles.logoIcon}
                            resizeMode="cover"
                            source={ImageIndex.logo}
                        />
                        {/* <View style={styles.companyNameWrapper}>
                            <Text style={styles.companyName}>
                            <Text style={styles.autoText}>C</Text>hawla <Text style={styles.autoText}>A</Text>uto <Text style={styles.autoText}>C</Text>omponents
                            </Text>
                        </View> */}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => setShow(!show)}>
                        <Feather
                            name='sort-down'
                            size={20}
                        />
                    </TouchableOpacity>
                    {show && <View style={styles.versionTextWrapper}>
                        <Text style={styles.versionText}>Version 3.0.55</Text>
                    </View>}
                    <TouchableOpacity onPress={() => setShow(!show)} style={{ marginRight: 5 }}>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                            {auth.authData?.name.length > 15
                                ? auth.authData?.name.substring(0, 15) + ' ...'
                                : auth.authData?.name}
                        </Text>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity onPress={toggleModal}>
                            {profilePic?.profilePicture ? (
                                <Image
                                    style={styles.profilePicture}
                                    resizeMode="cover"
                                    source={{ uri: profilePic?.profilePicture }}
                                />
                            ) : (
                                <Image
                                    source={{
                                        uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                                    }}
                                    style={styles.profilePicture}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <TouchableOpacity style={styles.loginButton} onPress={() => handleClearData()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <Feather name='dumpster-fire' size={29} color={'#a3a3a3'} style={{}} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.buttonText}>Clear Data (डेटा हटाएँ)</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton1} onPress={() => handlePage()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <Feather name='fort-awesome' size={29} color={'#e11d48'} style={{}} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.buttonText1}>HomePage (मुखपृष्ठ)</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton3} onPress={() => changeLanguage('hi')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <Feather name='language' size={29} color={'#d97706'} style={{}} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.buttonText1}>Switch to Hindi (हिंदी) </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton5} onPress={() => changeLanguage('en')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <Feather name='language' size={29} color={'#4c0519'} style={{}} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.buttonText1}>Switch to English (अंग्रेज़ी)</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton2} onPress={() => handleLogOut()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View>
                                    <Feather name='sign-out-alt' size={29} color={'#84cc16'} style={{}} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={styles.buttonText}>Logout (लॉग आउट)</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        // backgroundColor: 'yellow',
        borderColor: '#D9D9D9',
        borderBottomWidth: 1,
    },
    loginButton: {
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        height: '9%',
        borderRadius: 14,
        width: '65%',
        padding: 20,
        margin: 5
    },
    loginButton1: {
        backgroundColor: '#bbf7d0',
        justifyContent: 'center',
        alignItems: 'center',
        height: '9%',
        borderRadius: 14,
        width: '65%',
        padding: 20,
        margin: 5
    }, loginButton2: {
        backgroundColor: '#f87171',
        justifyContent: 'center',
        alignItems: 'center',
        height: '9%',
        borderRadius: 14,
        width: '65%',
        padding: 20,
        margin: 5
    }, loginButton3: {
        backgroundColor: '#67e8f9',
        justifyContent: 'center',
        alignItems: 'center',
        height: '9%',
        borderRadius: 14,
        width: '65%',
        padding: 20,
        margin: 5
    },
    loginButton5: {
        backgroundColor: '#fbcfe8',
        justifyContent: 'center',
        alignItems: 'center',
        height: '9%',
        borderRadius: 14,
        width: '65%',
        padding: 20,
        margin: 5
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
    },
    buttonText1: {
        color: '#404040',
        paddingLeft: 10,
    }, buttonText2: {
        color: 'white',
        paddingLeft: 10,
    }, buttonText3: {
        color: 'white',
        paddingLeft: 10,
    }, buttonText5: {
        color: 'white',
        paddingLeft: 10,
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
        width: Dimensions.get('window').height * 0.113,
        height: Dimensions.get('window').height * 0.064,
        resizeMode: 'contain'
    },
    companyNameWrapper: {
        paddingHorizontal: Dimensions.get('window').width * 0.02,
    },
    companyName: {
        fontSize: Dimensions.get('window').height * 0.012,
        color: '#283093',
        fontWeight: '500',
        textDecorationLine: 'underline'
    },

    profilePicture: {
        width: Dimensions.get('window').height * 0.04,
        height: Dimensions.get('window').height * 0.04,
        borderRadius: Dimensions.get('window').height * 0.02,
    },
    versionText: {
        fontSize: 16,
        color: 'black',
        marginLeft: responsiveWidth(-26),
    },
    versionTextWrapper: {
        alignSelf: 'flex-end',
        paddingTop: responsiveHeight(6),
    },
    autoText: {
        fontSize: Dimensions.get('window').height * 0.020,
        fontWeight: 'bold',
    },
})