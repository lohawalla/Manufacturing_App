import React, { useEffect, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Pressable,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ScrollView,
    Alert,
    BackHandler
} from 'react-native';
import Modal from 'react-native-modal';
import Navbar from '../../components/Navbar/Navbar';
import CureentSlips from './CurrentSlips/CureentSlips';
import Logs from './Logs/Logs';
import { ImageIndex } from '../../assets/AssetIndex';
import ReactNativeModal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleWorkOrderAsync } from '../../redux/Slice/workOrderSlice';
import { RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { activeCurrentSlipAsync, generateProductionSlipAsync } from '../../redux/Slice/productionSlice';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { styles } from './styles';
const SingleWorkOrder = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState('Current Slips');
    const [showModal, hideModal] = useState(false)
    const [value, setValue] = useState()
    const [selectedItem, setSelectedItem] = useState(null);
    const animatedValue = React.useRef(new Animated.Value(activeTab === 'Current Slips' ? 0 : 1)).current;
    const dispatch = useDispatch();
    const route = useRoute()
    const ele: any = route.params || {};
    useEffect(() => {
        dispatch(getSingleWorkOrderAsync(ele.id))
        dispatch(activeCurrentSlipAsync(ele.id, "inactive"));
    }, [])
    const singleWorkOrderList = useSelector((state: any) => state.workOrder.singleWorkOrders);
    console.log("5645644566456", singleWorkOrderList);
    const uniqueProcessNames = [...new Set(singleWorkOrderList?.masterBom?.map((item: any) => item?.process))];
    console.log("5645644566456", uniqueProcessNames);
    const startAnimation = (toValue: any) => {
        Animated.timing(animatedValue, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            setActiveTab(toValue === 0 ? 'Current Slips' : 'Logs');
        });
    };
    const left = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['2%', '50%'],
        extrapolate: 'clamp',
    });
    const scale = animatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0.9, 1],
        extrapolate: 'clamp',
    });
    const handleLoginPress = () => {
        hideModal(!showModal)
    }
    const handleSelect = (id: any) => {
        console.log("i am selected item idddddddddd", id);
        setSelectedItem(id);
    };
    const Button = ({ children, ...props }: any) => (
        <View style={styles.button}>
            <TouchableOpacity {...props}>
                <Text style={styles.buttonText1}>{children}</Text>
            </TouchableOpacity>
        </View>
    );
    const handleSlipGeneration = () => {
        const uniData = {
            workOrderId: ele.id,
            childPartId: selectedItem
        };
        console.log("UNiversal Data", uniData);
        dispatch(generateProductionSlipAsync(uniData))
            .then((response: any) => {
                console.log("API call succeeded:", response?.payload?.success);
                let msg
                (response?.payload?.success) ? msg = 'SUCCESS' : msg = 'DANGER'
                if (msg == "SUCCESS") {
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: msg,
                        textBody: response.payload.message,
                        button: 'close',
                    })
                } else {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: msg,
                        textBody: response.payload.message,
                        button: 'close',
                    })
                }
                hideModal(!showModal);
                navigation.navigate('dashboard');
            })
            .catch((error: any) => {
                console.error("API call failed:", error);
                hideModal(!showModal);
                navigation.navigate('dashboard');
            });
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const handleBackButton = () => {
        navigation.navigate("Work");
        return true;
    };
    const NoInternetModal = ({ show, isRetrying, data }: any) => (
        <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
            <View style={[styles.modalContainer, { height: '80%' }]}>
                <View style={{ flex: 1, justifyContent: 'space-around', flexDirection: 'row', alignItems: "center" }}>
                    <View>
                        <Text style={{ color: 'black', marginRight: 150, padding: 10, fontWeight: '700', fontSize: 18, lineHeight: 22.37 }}>Choose a Process</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => hideModal(!showModal)}>
                            <Feather
                                name={"x"}
                                size={18}
                                color={'black'}
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={data?.masterBom}
                    renderItem={({ item }) => (
                        console.log(item),
                        <View style={[styles.card, { flexDirection: 'row' }]}>
                            <View>
                                <Text style={{ color: '#666666', fontWeight: '500', fontSize: 14, lineHeight: 16.94 }}>{item.partName}</Text>
                                <Text style={{ color: '#949494', fontWeight: '400', fontSize: 12, lineHeight: 14.52, fontFamily: 'Inter' }}>{item?.process}</Text>
                            </View>
                            <View style={{ marginLeft: '50%' }}>
                                <RadioButton.Android
                                    value={item._id}
                                    status={selectedItem === item._id ? 'checked' : 'unchecked'}
                                    onPress={() => handleSelect(item._id)}
                                />
                            </View>
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
    const fetchChild = () => {
    }
    return (
        <View>
            <Navbar navigation={navigation} />
            <FlashMessage position={'top'} />
            <View style={{ backgroundColor: 'white', }}>
                <View style={{ marginLeft: 20, }}>
                    <View style={{ marginLeft: 5, margin: responsiveHeight(1) }}>
                        <Text>Work Order #{ele?.orderNumber}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                        }}
                    >
                        <View style={{ marginLeft: -40 }}>
                            <Text
                                numberOfLines={2}
                                ellipsizeMode='tail'
                                style={{
                                    color: 'black',
                                    fontSize: 18,
                                    fontWeight: '700',
                                    height: responsiveHeight(5.9),
                                    marginLeft: responsiveWidth(12),
                                }}
                            >
                                {ele?.finishItemName}
                            </Text>
                        </View>
                        <View style={{ marginTop: 22, marginRight: 18 }}>
                            <Text>{ele?.orderQuantity} Items</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.sliderContainer}>
                        <Animated.View style={[styles.slider, { left }]} />
                        <Pressable
                            style={styles.clickableArea}
                            onPress={() => startAnimation(0)}
                        >
                            <Animated.Text
                                style={[styles.sliderText, { transform: [{ scale }] }]}
                            >
                                Current Slips
                            </Animated.Text>
                        </Pressable>
                        <Pressable
                            style={styles.clickableArea}
                            onPress={() => startAnimation(1)}
                        >
                            <Animated.Text
                                style={[styles.sliderText, { transform: [{ scale }] }]}
                            >
                                Logs
                            </Animated.Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={{}}>
                {activeTab == 'Current Slips' ? (
                    <CureentSlips navigation={navigation} id={ele.id} />
                ) : (
                    <Logs navigation={navigation} id={ele.id} uniqueProcess={uniqueProcessNames} />
                )}
            </View>
            <View>
                <Modal isVisible={showModal} style={styles.modal} animationInTiming={600} onBackdropPress={() => hideModal(false)} onBackButtonPress={() => hideModal(false)}>
                    <View style={[styles.modalContainer, { height: '80%' }]}>
                        <View style={{ justifyContent: 'space-around', flexDirection: 'row', alignItems: "center" }}>
                            <View>
                                <Text style={{ color: 'black', marginRight: responsiveWidth(40), padding: 10, fontWeight: '700', fontSize: 18, lineHeight: 22.37, marginBottom: responsiveHeight(4) }}>Choose a Process</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => hideModal(!showModal)}>
                                    <Feather
                                        name={"x"}
                                        size={18}
                                        color={'black'}
                                        style={{ marginLeft: 5, marginBottom: responsiveHeight(4) }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <FlatList
                            data={singleWorkOrderList?.masterBom}
                            renderItem={({ item }) => (
                                console.log(item),
                                <View style={[styles.card, { justifyContent: 'space-around' }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#666666', fontWeight: '500', fontSize: 14, lineHeight: 16.94 }}>{item.partName}</Text>
                                        <Text style={{ color: '#949494', fontWeight: '400', fontSize: 12, lineHeight: 14.52, fontFamily: 'Inter' }}>{item?.process}</Text>
                                    </View>
                                    <View style={{ alignSelf: 'center', marginLeft: responsiveWidth(20) }}>
                                        <RadioButton.Android
                                            value={item._id}
                                            status={selectedItem === item._id ? 'checked' : 'unchecked'}
                                            onPress={() => handleSelect(item._id)}
                                            style={{}}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                        <Button onPress={() => handleSlipGeneration()}>
                            Generate Production Slip
                        </Button>
                    </View>
                </Modal>
            </View>
        </View>
    );
};



export default SingleWorkOrder;
