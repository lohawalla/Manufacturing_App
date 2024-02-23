import { Text, TouchableOpacity, View, Alert, ScrollView, RefreshControl, Modal as Modal1, KeyboardAvoidingView, ActivityIndicator, InteractionManager } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useAuthContext } from '../../auth/AuthGuard';
import Navbar from '../../components/Navbar/Navbar';
import { useDispatch } from 'react-redux';
import { Camera } from 'react-native-vision-camera';
import Feather from 'react-native-vector-icons/Feather';
import NetInfo from '@react-native-community/netinfo';
import { ViewfinderCircleIcon } from "react-native-heroicons/solid";
import axios, { CanceledError } from 'axios';
import DeviceInfo from 'react-native-device-info';
import UserAgent from 'react-native-user-agent';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { ALERT_TYPE, Dialog, } from 'react-native-alert-notification';
import { getShiftTimingsAsync } from '../../redux/Slice/workOrderSlice';
import AnimatedLoader from '../../components/AnimatedLoader/AnimatedLoader';
import CustomCard from '../../components/CardComp/Card';
import Tts from 'react-native-tts';
import { useGetAllEmployeesQuery, useGetAllMachinesMutation, useGetNegativeInventoryMutation, useGetPreviousShopLogsQuery, useGetTotalSlipsQuery } from '../../redux/features/apis2/Manufacturing';
import { ApplicationStackParamList } from '../navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Employee = {
};
type TotalList = {
    createdAt: string;
    date: string;
    dayShiftStart: string;
    employees: Employee[];
    shopId: string;
    updatedAt: string;
    __v: number;
    _id: string;
    dayShiftEnd: string;
    nightShiftEnd: string;
    nightShiftStart: string;
};
type DashboardProps = NativeStackScreenProps<ApplicationStackParamList, 'Dashboard'>;

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    const route = useRoute()
    const R: any = route.params;
    console.log(R);
    const { t } = useTranslation();
    const [isLoading1, setLoading1] = useState<boolean>(false);
    const [isOffline, setOfflineStatus] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [data1, setData1] = useState('');
    const [isDayButtonDisabled, setIsDayButtonDisabled] = useState<boolean>(true);
    const [isNightButtonDisabled, setIsNightButtonDisabled] = useState<boolean>(true);
    const [shiftTime, setShiftTime] = useState('');
    const auth: any = useAuthContext();
    console.log(auth.authData);
    const dispatch = useDispatch();
    const updateButtonStatus = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const isDayButtonDisabled = currentHour < 6 || currentHour >= 20;
        const isNightButtonDisabled = currentHour < 19 && currentHour >= 8
        setIsDayButtonDisabled(isDayButtonDisabled);
        setIsNightButtonDisabled(isNightButtonDisabled);
    };
    console.log(isDayButtonDisabled, isNightButtonDisabled)
    useEffect(() => {
        const updateButtonStatusWithSeconds = () => {
            updateButtonStatus();
        };
        const timerInterval = setInterval(() => {
            updateButtonStatusWithSeconds();
        }, 1000);
        updateButtonStatusWithSeconds();
        return () => clearInterval(timerInterval);
    }, []);
    const { data: allEmployees, isError: employeeError, isSuccess: isEmployeeSuccess, refetch: employeeRefetch, isFetching: employeeFetching } = useGetAllEmployeesQuery({}, { refetchOnMountOrArgChange: true });
    const [addNewPost, { data: allMachines, isError: machineError, isLoading: machineLoading }] = useGetAllMachinesMutation();
    const [addNewPostNegative, { data: negativeInventory, isError: negativeInventoryError, isLoading: negativeInventoryLoading }] = useGetNegativeInventoryMutation();
    const { data: completedSlips, isError: completedSlipsError, isSuccess: isCompletedSlipsSuccess, isFetching: completedSlipsFetching, refetch: completedSlipsRefetch } = useGetTotalSlipsQuery("completed", { refetchOnMountOrArgChange: true })
    const { data: inactiveSlips, isError: inActiveSlipsError, isSuccess: isinActiveSlipsSuccess, isFetching: inActiveSlipsFetching, refetch: inActiveSlipsRefetch } = useGetTotalSlipsQuery("inactive", { refetchOnMountOrArgChange: true })
    const { data: activeSlips, isError: ActiveSlipsError, isSuccess: isActiveSlipsSuccess, isFetching: ActiveSlipsFetching, refetch: ActiveSlipsRefetch } = useGetTotalSlipsQuery("active", { refetchOnMountOrArgChange: true })
    const { data: previousLogs, isError: previousLogsError, isSuccess: previousLogsSuccess, isFetching: previousLogsFetching, refetch: previousLogsRefetch } = useGetPreviousShopLogsQuery({}, { refetchOnMountOrArgChange: true });
    const filteredFalseMachines = (allEmployees?.employeeArray)?.filter((machine: any) => !machine.active);
    const filteredTrueMachines = (allEmployees?.employeeArray)?.filter((machine: any) => machine.active);  
    const filteredeActiveMachines = (allMachines?.machineArray)?.filter((machine: any) => !machine.active);
    const filteredInactiveMachines = (allMachines?.machineArray)?.filter((machine: any) => machine.active);
    if (employeeError) {
        console.error('Error fetching employees:', employeeError);
    }
    const negativeTotal = negativeInventory?.cardData?.negativeTotal
    console.log(machineLoading, allMachines, machineError, negativeTotal, inactiveSlips, activeSlips);
    (async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            const ipAddress = response.data.ip;
            const _j: any = UserAgent.getUserAgent();
            const platform = DeviceInfo.getSystemName();
            console.log(ipAddress, _j, platform);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    })();
    useEffect(() => {
        addNewPost({});
        addNewPostNegative(auth?.authData?.jobProfileId?._id)
    }, [])
    useEffect(() => {
        addNewPost({});
        addNewPostNegative(auth?.authData?.jobProfileId?._id)
    }, [auth?.authData?._id])
    const totalShoplogs: TotalList = (previousLogs?.shopLog)
    const negative = negativeInventory?.cardData?.negativeTotal
    const handleSpeak = () => {
        if (negative !== null && negative !== undefined) {
            Tts.speak(`${auth.authData?.name} Aapka negative Inventory  hai ${negative}`);
        }
    }
    useEffect(() => {
        const determineShift = () => {
            const {
                dayShiftEnd,
                dayShiftStart,
                nightShiftEnd,
                nightShiftStart
            } = totalShoplogs || {};
            const shiftConditions = [
                {
                    condition: !dayShiftStart && !nightShiftStart,
                    shift: 'Please select your shift',
                    log: 'Please select your shift'
                },
                {
                    condition: !dayShiftEnd && dayShiftStart && !nightShiftEnd && !nightShiftStart,
                    shift: 'Day Shift Started',
                    log: 'dayShiftStart'
                },
                {
                    condition: dayShiftEnd && dayShiftStart && !nightShiftEnd && !nightShiftStart,
                    shift: 'Day Shift Ended',
                    log: 'dayShiftEnd'
                },
                {
                    condition: dayShiftEnd && dayShiftStart && nightShiftEnd && nightShiftStart,
                    shift: 'Night Shift Ended',
                    log: 'nightShiftEnd'
                },
                {
                    condition: dayShiftEnd && dayShiftStart && !nightShiftEnd && nightShiftStart,
                    shift: 'Night Shift Started',
                    log: 'nightShiftStart'
                }
            ];
            const matchedCondition = shiftConditions.find(({ condition }) => condition);
            if (matchedCondition) {
                setShiftTime(matchedCondition.shift);
                console.log(matchedCondition.log);
            } else {
                setShiftTime('Please select your shift');
                console.log('Please select your shift');
            }
        };
        determineShift();
        handleSpeak()
    }, [totalShoplogs, negative]);
    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                completedSlipsRefetch();
                inActiveSlipsRefetch();
                ActiveSlipsRefetch();
            });
            return () => task.cancel();
        }, [completedSlipsRefetch, inActiveSlipsRefetch, ActiveSlipsRefetch, navigation])
    );
    const voice = Tts.voices().then((voices) => voices.filter((el) => el.id == "hi-IN-language"));
    voice.then(async (voices) => {
        console.log(voices);
        if (voices) {
            await Tts.setDefaultLanguage(voices[0].language);
            await Tts.setDefaultVoice(voices[0].id);
        } else {
            console.error('Error setting default language or voice. Voices array is empty or does not have enough elements.');
        }
    })
    let completedCount = completedSlips && completedSlips.data.length;
    let inActiveCount = inactiveSlips && inactiveSlips.data.length;
    let activeCount = activeSlips && activeSlips.data.length;
    const completedData: any[] = completedSlips && completedSlips.data;
    const inActiveData: any[] = inactiveSlips && inactiveSlips.data;
    const activeData: any[] = activeSlips && activeSlips.data;
    const checkCameraPermission = async () => {
        let status = await Camera.getCameraPermissionStatus();
        if (status !== 'authorized') {
            await Camera.requestCameraPermission();
            status = await Camera.getCameraPermissionStatus();
            if (status === 'denied') {
                Alert.alert(
                    'You will not be able to scan if you do not allow camera access.',
                );
            }
        }
    };
    useEffect(() => {
        checkCameraPermission();
    }, []);
    useLayoutEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        return () => removeNetInfoSubscription();
    }, [navigation]);
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            addNewPost({});
            employeeRefetch();
            previousLogsRefetch();
            completedSlipsRefetch();
            inActiveSlipsRefetch();
            ActiveSlipsRefetch();
            addNewPostNegative(auth?.authData?.jobProfileId?._id)
            handleSpeak();
        } catch (error) {
            console.error('Error on refresh:', error);
        } finally {
            setRefreshing(false);
        }
    };
    const handlePress = (shift: string) => {
        setShowModal(true);
        setData1(shift);
    }
    const handleShiftPress = async (shift: string) => {
        if ((shift === "End Shift" && activeCount > 0)) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: `आप शिफ्ट अंत नहीं कर सकते । आपकी सक्रिय पर्चियाँ ${activeCount} हैं |`,
                button: 'close',
            });
            previousLogsRefetch();
            setShowModal(false);
            return
        }
        console.log(shift);
        setLoading1(true);
        let details: Record<string, boolean> = {};
        if (data1 === 'Night') {
            details = shift === 'Start Shift' ? { "nightShiftStart": true } : { "nightShiftEnd": true };
        } else {
            details = shift === 'Start Shift' ? { "dayShiftStart": true } : { "dayShiftEnd": true };
        }
        try {
            const ele = await dispatch(getShiftTimingsAsync(details));
            console.log(ele);
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: `${shift} Successfully`,
                button: 'close',
            });
        } catch (err: any) {
            console.log(err);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Some Error Occurred',
                button: 'close',
            });
        } finally {
            setLoading1(false);
            previousLogsRefetch();
            setShowModal(false);
        }
    };
    console.log(employeeFetching, machineLoading, completedSlipsFetching, previousLogsFetching, inActiveSlipsFetching, ActiveSlipsFetching);
    if (machineLoading || previousLogsFetching || inActiveSlipsFetching || ActiveSlipsFetching) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <Navbar navigation={navigation} active={activeCount} />
            <KeyboardAvoidingView>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    {(
                        <View>
                            <View>
                                <Text numberOfLines={1} style={{ fontSize: 18, lineHeight: 22.37, fontFamily: "Inter", color: "#2E2E2E", margin: 5 }}>Welcome! {auth.authData?.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                <TouchableOpacity style={{ borderWidth: 1, padding: 12, backgroundColor: '#283093', borderRadius: 20, width: 132 }} onPress={() => handlePress("Night")} disabled={isNightButtonDisabled}>
                                    {isDayButtonDisabled && !isNightButtonDisabled &&
                                        <View style={styles.badgeContainer1}>
                                            <Feather
                                                name={"circle"}
                                                color={'black'}
                                                size={10}
                                                style={{ marginLeft: 5, color: '#27AE60', backgroundColor: '#27AE60', borderRadius: 50 }}
                                            />
                                        </View>
                                    }
                                    {isLoading1 ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <View>
                                            <Text style={{ color: 'white', alignSelf: 'center' }}>Night Shift</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderWidth: 1, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 20, width: 132 }} onPress={() => handlePress("Day")} disabled={isDayButtonDisabled}>
                                    {!isDayButtonDisabled && isNightButtonDisabled &&
                                        <View style={styles.badgeContainer1}>
                                            <Feather
                                                name={"circle"}
                                                color={'black'}
                                                size={10}
                                                style={{ marginLeft: 5, color: '#27AE60', backgroundColor: '#27AE60', borderRadius: 50 }}
                                            />
                                        </View>
                                    }
                                    {isLoading1 ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Text style={{ color: 'black', alignSelf: 'center' }}>Day Shift</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Modal1
                                    visible={showModal}
                                    animationType="slide"
                                    transparent={true}
                                    onRequestClose={() => setShowModal(false)}
                                >
                                    <View style={styles.modalContainer1}>
                                        <View style={styles.centeredView}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={styles.modalContent}>
                                                    <Feather
                                                        name={data1 === 'Night' ? 'moon' : 'sun'}
                                                        size={20}
                                                    />
                                                    <Text style={{ color: '#283093', fontSize: 16, marginLeft: 5 }}>{data1} Shift</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: 38.5 }}>
                                                <Text style={{ fontSize: 18, fontWeight: '700' }}>What do You Want to do?</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                                                <TouchableOpacity style={{ borderWidth: 1, padding: 10, marginRight: 20, width: 100, borderRadius: 8 }} onPress={() => handleShiftPress('Start Shift')} disabled={shiftTime === 'Day Shift Started' || shiftTime === 'Night Shift Started'}>
                                                    <Text style={{ textAlign: 'center', color: '#2E2E2E' }}>
                                                        {shiftTime === 'Day Shift Started' || shiftTime === 'Night Shift Started' ? 'Already Started' : 'Start Shift'}
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ borderWidth: 1, padding: 10, width: 100, borderRadius: 8, backgroundColor: '#283093' }} onPress={() => handleShiftPress('End Shift')} disabled={shiftTime === 'Day Shift Ended' || shiftTime === 'Night Shift Ended'}>
                                                    <Text style={{ textAlign: 'center', color: 'white' }}>{shiftTime === 'Day Shift Ended' || shiftTime === 'Night Shift Ended' ? 'Already Ended' : 'End Shift'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={{ marginTop: 20, width: '100%', borderTopWidth: 1, alignContent: 'center', justifyContent: 'center', backgroundColor: '#dc2626', padding: 10, borderRadius: 10 }} onPress={() => setShowModal(false)}>
                                                <Text style={{ fontSize: 18, color: '#fff', textAlign: 'center', marginTop: '1.5%' }}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal1>
                            </View>
                            <View style={{ marginTop: '3%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text numberOfLines={1} style={{ fontSize: 18, lineHeight: 22.37, fontFamily: "Inter", color: "#2E2E2E", margin: 5 }}>My Details</Text>
                                    </View>
                                    <View style={{ marginRight: 12, padding: 8, }}>
                                        {/* <Clock /> */}
                                        <Text style={{ fontSize: 18, lineHeight: 22.37, fontFamily: "Inter", color: "#2E2E2E" }}>{shiftTime}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 5 }}>
                                    <CustomCard name={'Employees'} active={filteredTrueMachines} inActive={filteredFalseMachines} navigation={navigation} />
                                    <CustomCard name={'Machine'} active={filteredInactiveMachines} inActive={filteredeActiveMachines} navigation={navigation} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View> 
                                        <Text numberOfLines={1} style={{ fontSize: 18, lineHeight: 22.37, fontFamily: "Inter", color: "#2E2E2E", margin: 5 }}>My Slips</Text>
                                    </View>
                                    <View style={{ marginRight: 12, padding: 8, }}>
                                        {/* <Clock /> */}
                                        <Text style={{ fontSize: 18, lineHeight: 22.37, fontFamily: "Inter", color: "#2E2E2E" }}>{negativeInventory?.cardData ? negativeInventory?.cardData?.negativeTotal : 0}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 5 }}>
                                    <TouchableOpacity style={{ borderWidth: 1, width: 168, height: 129, backgroundColor: '#ECEDFE52', alignItems: 'center', justifyContent: 'center', borderColor: '#ECEDFE52', borderRadius: 2, elevation: 0.1 }} onPress={() => navigation.navigate('CompletedSlip', { data: inActiveData, type: "Inactive" })}>
                                        <View>
                                            <Text style={styles.badgeText}>{inActiveCount || 0}</Text>
                                        </View>
                                        <Text numberOfLines={1} style={{ color: '#283093', marginTop: 10 }}> InActive Slips</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderWidth: 1, width: 168, height: 129, backgroundColor: '#ECEDFE52', alignItems: 'center', justifyContent: 'center', borderColor: '#ECEDFE52', borderRadius: 2, elevation: 0.1 }} onPress={() => navigation.navigate('CompletedSlip', { data: activeData, type: "Active" })}>
                                        <Text style={styles.badgeText1}>{activeCount || 0}</Text>
                                        <View>
                                            <Text numberOfLines={1} style={{ color: '#283093', marginTop: 10, }}>Active Slips</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ marginTop: 2 }}>
                                <TouchableOpacity style={{ borderWidth: 1, width: 320, height: 53, borderColor: '#283093', alignSelf: 'center', borderRadius: 2, marginTop: 20 }} onPress={() => navigation.navigate('Completed')}>
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText2}>{completedCount}</Text>
                                    </View>
                                    <Text style={{ alignSelf: 'center', color: '#283093', marginTop: 15, fontSize: 18, lineHeight: 24, fontWeight: '700' }}>View Complete Slip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Camera')}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 5 }}>
                                        <View>
                                            <Text style={{}}>
                                                <ViewfinderCircleIcon color="red" fill="white" size={45} />
                                            </Text>
                                        </View>
                                        <Text style={[styles.buttonText]}>{t('Scan Slip')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                    }
                </ScrollView>
            </KeyboardAvoidingView >
        </View >
    )
}
export default Dashboard;

