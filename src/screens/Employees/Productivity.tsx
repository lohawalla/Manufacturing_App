import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { empProductivityAsync } from '../../redux/Slice/machineSlice';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { DataTable, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native';
import Feather from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from './styles';

const Productivity = ({ navigation }: any) => {
    const { t } = useTranslation();
    const route: any = useRoute();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [searchResults, setSearchResults] = useState([]);
    const { confirmIds } = route.params;
    const arr = confirmIds[0];
    const arr1 = confirmIds[1];
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const handleDateChange = (selectedDate: any) => {
        setDate(selectedDate);
        setShow(false);
    };
    const showDatepicker = () => {
        setShow(true);
    };
    const onChange = (_: any, selectedDate: any) => {
        setShow(false);
        handleDateChange(selectedDate);
    };
    useEffect(() => {
        setLoading(true); // Set loading to true before the operation starts
        dispatch(empProductivityAsync({ arr, date }))
            .then((res: any) => {
                console.log(res);
                setLoading(false); // Set loading to false when the operation is successful
            })
            .catch((error:any) => {
                console.error(error);
                setLoading(false); // Set loading to false when there's an error
            });
    }, [arr, date]);
    const arr2 = useSelector((state: any) => state.machine.empProductivity);
    const getCombinedArray = () => {
        if (!arr2) {
            return [];
        }
        return arr1.map((employee: any) => {
            const employeeId = employee.employeeId;
            const productivityData = arr2[employeeId];
            if (productivityData) {
                return {
                    employeeName: employee.employeeName,
                    employeeId: employeeId,
                    productivity: productivityData.productivity,
                    totalHours: productivityData.totalHours,
                };
            }
        });
    };
    useEffect(() => {
        const combinedArray = getCombinedArray();
        setSearchResults(combinedArray);
        console.log(combinedArray);
    }, [arr2]);
    if (loading) {
        return <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
        />;
    }
    return (
        <View style={{ backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />
            <View style={{ padding: '6%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderRadius: 8 }}>
                <Text style={{ fontSize: 20, color: '#2E2E2E', fontWeight: '700', textDecorationLine: 'underline' }}>Employee Report</Text>
                <View>
                    <TouchableOpacity onPress={() => setShow(!show)}>
                        <Feather
                            name="calendar-check"
                            size={32}
                            color={'black'}
                        />
                    </TouchableOpacity>
                    {/* <Button title="Pick a Date" onPress={showDatepicker} />
                    <Button title="Pick a Time" onPress={showTimepicker} /> */}
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(date)} // Convert 'date' string back to a Date object
                            mode="date" // You can set this to 'date' or 'time' as needed
                            onChange={(_, selectedDate) => {
                                handleDateChange(selectedDate);
                            }}
                        />
                    )}
                </View>
            </View>
            <View style={styles.mainbox}>
                <Card>
                    <DataTable>
                        <DataTable.Header style={{ flexWrap: 'wrap',backgroundColor:'#c7d2fe' }}>
                            <DataTable.Title textStyle={{ fontSize: 13, fontWeight: 'bold', color: '#000' }}>Name</DataTable.Title>
                            <DataTable.Title numeric textStyle={{ fontSize: 13, fontWeight: 'bold', color: '#000' }} numberOfLines={1}>Productivity</DataTable.Title>
                            <DataTable.Title numeric textStyle={{ fontSize: 13, fontWeight: 'bold', color: '#000' }}>Total Hours</DataTable.Title>
                            <DataTable.Title numeric textStyle={{ fontSize: 13, fontWeight: 'bold', color: '#000' }}>Idle Time</DataTable.Title>
                        </DataTable.Header>
                        {searchResults.length > 0 &&
                            <FlatList
                                data={searchResults}
                                renderItem={({ item, index }: any) => (
                                    <TouchableOpacity>
                                        <DataTable.Row key={item?.key} style={styles.tableRow}>
                                            <DataTable.Cell style={styles.tableCell}>{item?.employeeName}</DataTable.Cell>
                                            <DataTable.Cell numeric style={styles.tableCell}>{item?.productivity.toFixed(2)}</DataTable.Cell>
                                            <DataTable.Cell numeric style={styles.tableCell}>{item?.totalHours.toFixed(2)}</DataTable.Cell>
                                            <DataTable.Cell numeric style={styles.tableCell}>{item?.totalHours.toFixed(2)-item?.productivity.toFixed(2)}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                )}
                            />
                        }
                    </DataTable>
                </Card>
            </View>
        </View >
    )
}

export default Productivity
