import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { handleApiResponse } from '../Dashboard/fetchApi'
import { useDispatch, useSelector } from 'react-redux'
import { getDailyLogsReportAsync } from '../../redux/Slice/workOrderSlice'
import { TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import { responsiveHeight } from 'react-native-responsive-dimensions'
import { TextInput } from 'react-native'
import Navbar from '../../components/Navbar/Navbar'
import AnimatedLoader from '../../components/AnimatedLoader/AnimatedLoader'

const DailyLogs = ({ navigation }: any) => {
    const route = useRoute();
    const { id, name }: any = route.params;
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const [date, setDate] = useState('');
    const [searchQuery, setSearchQuery] = useState<any>('');
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    console.log(date);
    console.log(id, name);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const details = { date, id };
                const dailyLog = await dispatch(getDailyLogsReportAsync(details));
                handleApiResponse(dailyLog, 'Logs');
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [date, id, dispatch])
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const details = { date, id };
                    const dailyLog = await dispatch(getDailyLogsReportAsync(details));
                    handleApiResponse(dailyLog, 'Logs');
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [date, id, dispatch])
    );
    useEffect(() => {
        searchData(searchQuery);
    }, [searchQuery]);
    const DailyLogs = useSelector((state: any) => state.workOrder.dailyLogs)
    console.log(DailyLogs);
    const searchData = (searchQuery: any) => {
        if (!searchQuery) {
            return DailyLogs.result;
            ;
        }
        searchQuery = searchQuery.toLowerCase();
        const filteredList = DailyLogs.result.filter((item: any) => {
            const part = (item.CNCProgramName || '').toString().toLowerCase();
            const workOrder = (item.logNumber || '').toString().toLowerCase();
            return part.includes(searchQuery) || workOrder.includes(searchQuery);
        });
        if (filteredList.length === 0) {
            return [];
        }
        return filteredList;
    };
    if (loading) {
        return (
            <AnimatedLoader />
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '5%' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#2E2E2E' }}></Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#2E2E2E' }}>{name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                <View style={styles.searchBarContainer}>
                    <Feather
                        name="search"
                        size={18}
                        color={'black'}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by Process/Compo..."
                        onChangeText={text => setSearchQuery(text)}
                        value={searchQuery}
                        placeholderTextColor="gray"
                    />
                </View>
            </View>
            <View style={{ marginTop: 15, height: responsiveHeight(62) }}>
                <FlatList
                    data={searchQuery.length > 0 ? searchData(searchQuery) : DailyLogs.result}
                    renderItem={({ item, index }: any) => (
                        <View style={{ borderWidth: 1, borderColor: 'white', borderRadius: 8, marginBottom: responsiveHeight(2), justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ backgroundColor: '#F5F5F5', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', flexDirection: 'row', padding: 15, justifyContent: 'space-between', width: '92%' }}>
                                <View style={{ borderRadius: 8, width: 300, marginBottom: responsiveHeight(2) }}>
                                    <View style={{ backgroundColor: '#F5F5F5', width: '100%', borderBottomWidth: 1, borderBottomColor: '#F5F5F5', flexDirection: 'row', padding: 15, justifyContent: 'space-between' }}>
                                        <View style={{ justifyContent: 'flex-start' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 18 }}>Log Number:</Text>
                                                <Text style={{ color: '#4A4A4A', fontWeight: '500', fontSize: 16 }}>
                                                    {item.logNumber.length > 20
                                                        ? `${item.logNumber.substring(0, 20)}...`
                                                        : item.logNumber}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 18 }}>Sheet Consumed: </Text>
                                                <Text style={{ color: '#4A4A4A', fontWeight: '500', fontSize: 16 }}>{item.sheetConsumed}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 18 }}>Status: </Text>
                                                <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 16 }}> {item.status}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => setShow(!show)} style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 18 }}>Machines:</Text>
                                                <>
                                                    <Feather
                                                        name={show ? "chevron-up" : "chevron-down"}
                                                        size={25}
                                                        style={{ marginRight: 5, color: "#283093" }}
                                                    />
                                                    {show && (
                                                        <View style={{ flex: 1, marginLeft: 5 }}>
                                                            <Text style={{ fontSize: 15, color: '#000' }}>
                                                                {item.machines.map((ele: any) => ele.machineName).join('\n')}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setShow1(!show1)} style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: '#4A4A4A', fontWeight: 'bold', fontSize: 18 }}>Employees:</Text>
                                                <>
                                                    <Feather
                                                        name={show1 ? "chevron-up" : "chevron-down"}
                                                        size={25}
                                                        style={{ marginRight: 5, color: "#283093" }}
                                                    />
                                                    {show1 && (
                                                        <View style={{ flex: 1, marginLeft: 5 }}>
                                                            <Text style={{ fontSize: 15, color: '#000' }}>
                                                                {item.employees.map((ele: any) => ele.employeeName).join('\n')}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ backgroundColor: '#ECEDFE', padding: 16, flexDirection: 'row', justifyContent: 'space-between', elevation: 2, borderRadius: 8, width: '92%' }}>
                                <Text style={{ fontWeight: '700', fontSize: 16, color: '#283093' }}>{item.startTime.split("T")[0]}</Text>
                                <Text style={{ fontWeight: '700', fontSize: 16, color: '#283093' }}>{item.endTime.split("T")[0]}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        </View>
    )
}

export default DailyLogs

const styles = StyleSheet.create({
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
        color: '#333',
    },
    searchInput: {
        fontSize: 16,
        height: 48,
        flex: 1,
        color: 'black'
    },
    searchBarContainer: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        zIndex: 999,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        marginTop: 10, // Adjust as needed
        borderWidth: 1,
        borderColor: '#DEDEDE',
        marginLeft: '4%',
    }
})