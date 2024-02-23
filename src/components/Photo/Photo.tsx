import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { Dimensions } from 'react-native'

export const Photo = ({ setPhoto, setShowPhotoComponent }: any) => {
    const camera = useRef<any>(null)
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const devices = useCameraDevices();
    const device = devices.back;
    const { height } = Dimensions.get('window');
    console.log(height)
    const takePhoto = async () => {
        const options = {
            quality: 0.3,
            width: 1000,
            height: 1000,
            base64: true,
        };
        if (camera.current) {
            try {
                const photo = await camera.current.takePhoto(options);
                console.log(photo, "Photo captured");
                setCapturedPhoto(photo.path);
            } catch (error) {
                console.error("Error capturing photo:", error);
            }
        }
    };
    if (device == null) return <View><Text>Loading...</Text></View>;
    return (
        <View style={{ flex: 1 }}>
            {!capturedPhoto ? (
                <View style={{ flex: 1 }}>
                    <Camera
                        ref={camera}
                        style={{ ...StyleSheet.absoluteFillObject }}
                        device={device}
                        isActive={true}
                        photo={true}
                        
                    />
                    <TouchableOpacity style={{ backgroundColor: '#0078FB', padding: 20, width: '98%', alignSelf: 'center', borderRadius: 10, marginTop: height-200 }} onPress={takePhoto}>
                        <Text style={{ fontSize: 22, color: 'white', textAlign: 'center' }}>Confirm taken</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Image
                        source={{ uri: `file://${capturedPhoto}` }}
                        style={{ width: '100%', height: '89%' }}
                    />
                    <TouchableOpacity style={{ backgroundColor: '#0078FB', padding: 20, width: '98%', alignSelf: 'center', borderRadius: 10 }} onPress={() => (setPhoto(capturedPhoto), setShowPhotoComponent(false))}>
                        <Text style={{ fontSize: 22, color: 'white', textAlign: 'center' }}>Confirm taken</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

export default Photo

const styles = StyleSheet.create({})
