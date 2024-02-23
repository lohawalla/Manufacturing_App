import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert, BackHandler, ActivityIndicator, Vibration } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Navbar/Navbar'
import { ImageIndex } from '../../../assets/AssetIndex';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Modal as MyCustomModal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { allotWorkAsync } from '../../../redux/Slice/productionSlice';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from 'react-i18next';
import { ToastAndroid } from 'react-native';
import store from '../../../redux/store';
import Tts from 'react-native-tts';
import { useAuthContext } from '../../../auth/AuthGuard';
import Photo from '../../../components/Photo/Photo';

const LogProduction = ({ navigation }: any) => {
    const { t } = useTranslation();
    type AppDispatch = typeof store.dispatch;
    const dispatch = useDispatch<AppDispatch>();
    const [toTime, setToTime] = useState('');
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [fromTime, setFromTime] = useState('');
    const [produced, setProduced] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPhotoComponent, setShowPhotoComponent] = useState(false);
    const [photo, setPhoto] = useState(null);
    const route = useRoute();
    const auth: any = useAuthContext();
    const { ele, el }: any = route.params
    console.log(ele);
    BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack();
        return true;
    });
    const remainQuantity = useSelector((state: any) => state.production.remainQuantity)
    const allotedSlip = useSelector((state: any) => state.production.scannedSlips)
    console.log(allotedSlip);
    const handleSearch = () => {
        console.log('clicked')
    }
    const toggleTimePicker = () => {
        setTimePickerVisible(!isTimePickerVisible);
    };
    const handleTimeChange = (selectedTime: any) => {
        if (selectedTime) {
            // Format the selected time as desired (e.g., HH:mm AM/PM)
            const hours = selectedTime.getHours() % 12 || 12;
            const minutes = selectedTime.getMinutes();
            const ampm = selectedTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            setFromTime(formattedTime);
            toggleTimePicker();
        } else {
            toggleTimePicker();
        }
    };
    console.log(showPhotoComponent, photo)
    const openCamera = () => {
        setShowPhotoComponent(true);
    }
    const handleLog = async () => {
        console.log(fromTime)
        if (photo == null) {
            setShowPhotoComponent(true);
        } else {
            const formData = new FormData();
            formData.append('productionSlipNumber', allotedSlip.productionSlip.productionSlipNumber);
            formData.append('itemProduced', +produced)
            if (fromTime) {
                formData.append("durationTo", fromTime);
            } else {
                formData.append("durationTo", handleConfirm(Date.now()));
            }
            formData.append('file', {
                uri: `file://${photo}`,
                type: 'image/jpeg',
                name: '_image.jpg',
            });
            setLoading(true)
            dispatch(allotWorkAsync(formData)).then((response: any) => {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "success",
                    textBody: response.payload.message,
                })
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Log Edited successfully (पर्ची सफ़लता बंद की गयी |)",
                    button: 'close',
                })
                setLoading(false);
                navigation.navigate("dashboard")
            }).catch((error: any) => {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "failed",
                    textBody: error.message,
                })
                setLoading(false);
                navigation.navigate("dashboard")
            })
        }
    }
    useEffect(() => {
        checkAllFields();
    }, [fromTime, produced]);
    const checkAllFields = () => {
        if (
            fromTime &&
            +produced
            && +produced <= remainQuantity
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleSpeak = () => {
        Tts.speak(`${auth.authData?.name} आप आवश्यकता से अधिक इनपुट कर रहे हैं`);
    }
    useEffect(() => {
        if (+produced > remainQuantity) {
            handleSpeak();
            ToastAndroid.show("You are exceeding log.(आप लॉग से अधिक हो रहे हैं)", ToastAndroid.SHORT)
            Vibration.vibrate();
        }
    }, [produced])
    const handleConfirm = (time: any) => {
        const dateTime = new Date(time);
        if (dateTime) {
            const hours = dateTime.getHours() % 12 || 12;
            const minutes = dateTime.getMinutes();
            const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
            setFromTime((prevFromTime) => {
                return formattedTime;
            });
        }
        hideDatePicker();
    };
    console.log(el.itemProduced, el.numberOfItems);
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <View style={{ flex: 1 }}>
                {showPhotoComponent ? (<Photo setPhoto={setPhoto} setShowPhotoComponent={setShowPhotoComponent} />) :
                    (
                        <View>
                            <View style={{ marginTop: 30, marginLeft: 20 }}>
                                <Text style={{ color: '#666666', fontWeight: '500' }}>{t('WORK ORDER')} # {ele?.orderNumber}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: 'black', fontSize: 21, fontWeight: '700' }}>{ele?.finishItemName}</Text>
                                    <Text style={styles.TopText}>{ele?.orderQuantity} Items</Text>
                                </View>
                            </View>
                            <View >
                                <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
                                    <Text style={styles.TopGap}>{t('Production Slip')}</Text>
                                    <View style={{ width: '100%', height: '12%', backgroundColor: '#F0F0F0', marginTop: 6, borderRadius: 5, borderWidth: 0.3, borderColor: '#4A4A4A', justifyContent: 'center', alignItems: 'center', }}><Text style={{ fontWeight: '500', fontSize: 18 }}>{el?.part?.partName}-{el?.process?.processName}</Text></View>
                                    <Text style={styles.TopGap}>{t('Quantity Produced')}</Text>
                                    <TouchableOpacity style={styles.InputText}>
                                        <TextInput
                                            value={produced}
                                            onChangeText={(ele) => setProduced(ele)}
                                        />
                                        <Text style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -8 }] }}>
                                            / {remainQuantity}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={styles.TopGap}>{t('Duration')}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text
                                            style={styles.InputDuo}
                                        >{new Date(allotedSlip.productionSlip.durationFrom).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            timeZone: 'Asia/Kolkata',
                                        })}</Text>
                                        <Text style={{ fontSize: 15 }}>To</Text>
                                        <TouchableOpacity onPress={showDatePicker}>
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={[styles.InputDuo]}>{fromTime.length ? fromTime : String(handleConfirm(Date.now()))}</Text></View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="time"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                    />
                                </View>
                                <View >
                                    <TouchableOpacity onPress={() => handleLog()} style={[styles.BtnStyle, isButtonDisabled && styles.disabledButton]} disabled={isButtonDisabled}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Feather
                                                name={"plus"}
                                                size={25}
                                                color={'white'}
                                            />
                                            {loading ? (
                                                <ActivityIndicator color="#fff" size="small" />
                                            ) : (<Text style={styles.BTextStyle}>{photo !== null ? 'Log Production (पर्ची बंद करे)' : 'Capture Photo'}</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>
        </View >
    )
}

export default LogProduction

const styles = StyleSheet.create({
    TopText: {
        marginLeft: responsiveWidth(55), color: '#666666', fontWeight: '500'
    },
    InputDuo: { width: responsiveWidth(40), height: responsiveHeight(5), borderRadius: 5, borderWidth: 0.3, marginTop: 10, alignItems: 'center', justifyContent: 'center', paddingTop: responsiveHeight(1.5), paddingLeft: responsiveWidth(8.5) },
    TopGap: { marginTop: '10%', fontSize: 18, color: '#1C1C1C', fontWeight: '400' },
    InputText: {
        width: '100%', height: '15%', marginTop: 6, borderRadius: 5, borderWidth: 0.3,
    },
    BTextStyle: { color: 'white', fontWeight: '500', fontSize: 19, marginLeft: responsiveWidth(20), width: responsiveWidth(45), flexWrap: 'wrap' },
    BtnStyle: { backgroundColor: '#283093', marginRight: '50%', borderRadius: 9, padding: 12, justifyContent: 'center', alignItems: 'center', marginLeft: '5%' },
    CancelButton: {
        // Your styles for the cancel button
    },
    self: {
        paddingLeft: responsiveWidth(28),
        paddingTop: responsiveHeight(5.2)
    },
    disabledButton: {
        // Style for the disabled button
        backgroundColor: 'gray', // Gray background color for disabled button
        opacity: 0.6, // Reduce opacity for a disabled appearance
    },
})