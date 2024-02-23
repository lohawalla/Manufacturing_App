import { BackHandler, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native'
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { getMachinesAsync } from '../../redux/Slice/machineSlice';
import Accordion from '../../components/Accordian/Accordian';
import { useTranslation } from 'react-i18next';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import { useGetAllMachinesMutation } from '../../redux/features/apis2/Manufacturing';

const Machine = ({ navigation }: any) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [expanded3, setExpanded3] = useState(false);
    const [expanded2, setExpanded2] = useState(false);
    const [modal, setModal] = useState<any>(false);
    const [info, setInfo] = useState([{}])
    const [addNewPost, { data: allMachines, isError: machineError, isLoading: machineLoading }] = useGetAllMachinesMutation();
    useEffect(() => {
        addNewPost({});
        dispatch(getMachinesAsync())
    }, [])
    const filteredFalseMachines = (allMachines?.machineArray)?.filter((machine: any) => !machine.active);
    const filteredTrueMachines = (allMachines?.machineArray)?.filter((machine: any) => machine.active);
    // console.log("heiiiii",filteredMachines);
    console.log("555556666666", filteredFalseMachines);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        // Clean up the event listener when the component unmounts
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        };
    }, []);
    const handleBackButton = () => {
        // Prevent default behavior (going back)
        navigation.navigate("dashboard");
        return true;
    };
    const toggleHandle3 = () => {
        setExpanded3(!expanded3);
    }
    const toggleHandle2 = () => {
        setExpanded2(!expanded2);
    }
    const closeModal2 = () => {
        setModal(false);
    };
    const handleActivePress = (item: any) => {
        setModal(true);
        console.log(item);
        const prod = item.productionSlip;
        const data = ({
            lastWorked: prod.updatedAt,
            slipNumber: prod.productionSlipNumber
        })
        setInfo([data]);
    };
    const calculateTimeElapsed = (startTime: any) => {
        console.log(startTime)
        const currentTime: any = new Date();
        const startTimeDate: any = new Date(startTime);
        const timeDifference = Math.abs(currentTime - startTimeDate) / 1000;
        const days = Math.floor(timeDifference / 86400);
        const hours = Math.floor((timeDifference % 86400) / 3600);
        const minutes = Math.floor((timeDifference % 3600) / 60);
        const seconds = Math.floor(timeDifference % 60);
        const formattedTimeElapsed = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        return formattedTimeElapsed;
    };
    console.log(info);
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <View>
                <View style={{ marginTop: 32, marginLeft: 20 }}>
                    <Text style={{ color: '#2E2E2E', fontWeight: '700', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter' }}>{t('Machines')}</Text>
                </View>
                <View style={{ marginLeft: '10%' }}>
                    <View>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}
                            onPress={toggleHandle3}
                        >
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter' }}>{t('ACTIVE MACHINES')}</Text>
                            <Feather
                                name={expanded3 ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                style={{ marginLeft: '2%' }}
                            />
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter', marginLeft: '12%' }}>{filteredTrueMachines ? filteredTrueMachines?.length : 0}</Text>
                        </TouchableOpacity>
                        <View style={{ maxHeight: responsiveHeight(50) }}>
                            {expanded3 && (
                                <FlatList
                                    data={filteredTrueMachines}
                                    renderItem={({ item, index }: any) => (
                                        console.log(item),
                                        (
                                            <TouchableOpacity
                                                style={[
                                                    styles.card,
                                                    {
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        // marginLeft: responsiveWidth(2.5),
                                                    },
                                                ]}
                                                key={index}
                                                onPress={() => handleActivePress(item)}
                                            >
                                                <View>
                                                    {item.picture ? (<Image
                                                        source={{ uri: item.picture }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />) : (<Image
                                                        source={{ uri: "https://cdn.dribbble.com/users/1179255/screenshots/3869804/media/128901c4ce0bbbe670bfb35a6b204b93.png?resize=400x300&vertical=center" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />)}
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            color: '#666666',
                                                            fontWeight: '500',
                                                            fontSize: 14,
                                                            lineHeight: 16.94,
                                                            marginLeft: responsiveWidth(3.5)
                                                        }}
                                                    >
                                                        {item.machineName}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    )}
                                />
                            )}
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: '6%' }}
                            onPress={toggleHandle2}
                        >
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter' }}>{t('INACTIVE MACHINES')}</Text>
                            <Feather
                                name={expanded2 ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                style={{ marginLeft: '2%' }}
                            />
                            <Text style={{ color: '#2E2E2E', fontWeight: '500', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter', marginLeft: '10%' }}>{filteredFalseMachines ? filteredFalseMachines.length : 0}</Text>
                        </TouchableOpacity>
                        <View style={{ maxHeight: responsiveHeight(50) }}>
                            {expanded2 && (
                                <FlatList
                                    data={filteredFalseMachines}
                                    renderItem={({ item, index }: any) => (
                                        console.log(item),
                                        (
                                            <TouchableOpacity
                                                style={[
                                                    styles.card,
                                                    {
                                                        flexDirection: 'row',
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        // marginLeft: responsiveWidth(2.5),
                                                    },
                                                ]}
                                                key={index}
                                                onPress={() => handleActivePress(item)}
                                            >
                                                <View>
                                                    {item.profilePicture ? (<Image
                                                        source={{ uri: item.profilePicture }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />) : (<Image
                                                        source={{ uri: "https://cdn.dribbble.com/users/1179255/screenshots/3869804/media/128901c4ce0bbbe670bfb35a6b204b93.png?resize=400x300&vertical=center" }}
                                                        style={{
                                                            width: responsiveHeight(8),
                                                            height: responsiveHeight(8),
                                                            borderRadius: responsiveHeight(10),
                                                        }}
                                                    />)}
                                                </View>
                                                <View>
                                                    <Text
                                                        style={{
                                                            color: '#666666',
                                                            fontWeight: '500',
                                                            fontSize: 14,
                                                            lineHeight: 16.94,
                                                            marginLeft: responsiveWidth(3.5)
                                                        }}
                                                    >
                                                        {item.machineName}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    )}
                                />
                            )}
                        </View>
                    </View>
                    <Modal
                        visible={modal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={closeModal2}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' }}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Activated History</Text>
                                <FlatList
                                    data={info}
                                    renderItem={({ item }: any) => (
                                        <View>
                                            <View style={styles.itemContainer}>
                                                <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>Last Updated: </Text>
                                                <Text style={{ fontSize: 16, color: '#333' }}>{item.lastWorked ? calculateTimeElapsed(item.lastWorked) : "Not Alloted From Starting"}</Text>
                                            </View>
                                            <View style={styles.itemContainer}>
                                                <Text style={{ fontSize: 16, color: '#000', fontWeight: '700' }}>Last Worked On: </Text>
                                                <Text style={{ fontSize: 16, color: '#333' }}>{item.slipNumber ? item?.slipNumber : "Not Alloted from Starting"}</Text>
                                            </View>
                                        </View>
                                    )}
                                />
                                <TouchableOpacity onPress={closeModal2} style={{ alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </View>
    )
}
export default Machine
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        // elevation: 3,
        shadowColor: '#000',
        // shadowOffset: { width: '100%', height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        width: '100%',
        // marginRight: '65%',
        maxHeight: '60%'
    },
    itemContainer: {
        marginBottom: 16,
    },
})