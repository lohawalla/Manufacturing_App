import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Alert, BackHandler, TouchableOpacity, Text, Vibration } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { RNHoleView } from 'react-native-hole-view';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { scanProductionSlipAsync, suggestedEmployeesAsync, suggestedMachinesAsync } from '../../redux/Slice/productionSlice';
import { useDispatch } from 'react-redux';
import BarcodeMask from 'react-native-barcode-mask';
import { XMarkIcon } from 'react-native-heroicons/solid';
import HapticFeedback from 'react-native-haptic-feedback';
interface CamProps {
    navigation: any; 
}
const Cam: React.FC<CamProps> = ({ navigation }) => {
    const devices = useCameraDevices();
    const device = devices.back;
    const [torchOn, setTorchOn] = useState(false);
    const [isFocused, setIsFocused] = useState(true); // Track screen focus
    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS]);
    const [barcode, setBarcode] = useState<string>(''); // Provide a default value of an empty string
    const [hasPermission, setHasPermission] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        checkCameraPermission();
    }, []);
    const checkCameraPermission = async () => {
        const status = await Camera.getCameraPermissionStatus();
        setHasPermission(status === 'authorized');
    };
    useEffect(() => {
        toggleActiveState();
    }, [barcodes]);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        // Clean up the event listener when the component unmounts
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const options = {
        enableVibrateFallback: true, // If haptic feedback is not available, vibrate the device
        ignoreAndroidSystemSettings: false, // Respect Android system settings for haptic feedback
    };
    const toggleActiveState = async () => {
        if (barcodes && barcodes.length > 0 && !isScanned) {
            try {
                setIsScanned(true);
                let dataToNavigate = null; // Initialize data variable
                const errorMessages = [];
                for (const scannedBarcode of barcodes) {
                    if (scannedBarcode.rawValue && scannedBarcode.rawValue !== '') {
                        const data = scannedBarcode.rawValue;
                        console.log(data);
                        // Dispatch actions using async/await
                        const response1 = await dispatch(scanProductionSlipAsync(data));
                        const response2 = await dispatch(suggestedMachinesAsync(data));
                        const response3 = await dispatch(suggestedEmployeesAsync(data));
                        console.log('701478996686666666666666666', response1);
                        // Collect error messages or results
                        errorMessages.push(response1.payload instanceof Error ? response1.payload.message : null);
                        errorMessages.push(response2.payload instanceof Error ? response1.payload.message : null);
                        errorMessages.push(response3.payload instanceof Error ? response1.payload.message : null);
                        // Store the data if there are no errors
                        if (!errorMessages.some((errorMessage) => errorMessage !== null)) {
                            dataToNavigate = data;
                        }
                    }
                }
                Vibration.vibrate();
                // Filter out null values and check if there are any error messages
                if (errorMessages.some((errorMessage) => errorMessage !== null)) {
                    // Display errors to the user
                    console.warn(errorMessages.filter(Boolean).join('\n'));
                    Alert.alert('ये स्लिप दूसरे आपकी प्रोडक्शन की है या रद्द कर दिया गया है |');
                    navigation.navigate("dashboard")
                } else if (dataToNavigate !== null) {
                    // Navigate after successful operations using the stored data
                    Vibration.vibrate();
                    // HapticFeedback.trigger('impactLight', options);
                    navigation.navigate('ScannedSlip', { data: dataToNavigate });
                }
            } catch (error) {
                // Log the error to the console
                console.error(error);
                navigation.navigate("dashboard");
                // Display a more generic error message to the user
                Alert.alert('An unexpected error occurred. Please try again later.');
            }
        }
    };
    const handleBackButton = () => {
        // Prevent default behavior (going back)
        navigation.navigate("dashboard");
        return true;
    };

    return (
        device != null &&
        hasPermission && (
            <>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        zIndex: 1,
                    }}
                    onPress={() => handleBackButton()}
                >
                    <Text>
                        <XMarkIcon color="red" fill="white" size={42} />
                    </Text>
                </TouchableOpacity>
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={!isScanned}
                    frameProcessor={frameProcessor}
                    frameProcessorFps="auto"
                    audio={false}
                    enableZoomGesture
                />
                {/* <BarcodeMask
                    width={widthPercentageToDP('80%')}
                    height={heightPercentageToDP('30%')}
                    edgeRadius={10}
                /> */}
                <RNHoleView
                    holes={[
                        {
                            x: widthPercentageToDP('10.5%'),
                            y: heightPercentageToDP('25%'),
                            width: widthPercentageToDP('80%'),
                            height: heightPercentageToDP('30%'),
                            borderRadius: 10,
                        },
                    ]}
                    style={styles.rnholeView}
                />
            </>
        )
    );
};

// Styles:
const styles = StyleSheet.create({
    rnholeView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export default Cam;
