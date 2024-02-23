import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, RefreshControl, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { Picker } from '@react-native-picker/picker';
const Inventory = ({ navigation }: any) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<any>([]);
    const [innerdata, setInnerData] = useState<any>([])
    const [loading, setLoading] = useState(false);
    const [processName, setprocessName] = useState<any>([]);
    const [modal, setModal] = useState<any>(false);
    const [info, setInfo] = useState();
    const [modalContent, setModalContent] = useState(null);
    //shop 
    const fetchShop = async () => {
        try {
            const res = await axios.post(`https://chawlacomponents.com/api/v1/globalProcess`);
            console.log('processs', res.data.process);
            setprocessName(res.data.process);
            //console.log(jobProfiles.length)
        } catch (err) {
            console.log(err);
        }
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`https://chawlacomponents.com/api/v1/inventory`,{
                process:`${selectedOption}`,
                name:`${searchQuery}`
            });
            const data = response.data.newResult;
            console.log('data from apiii', data)
            setData(data);
            setLoading(false)
        }
        catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false)
        }
    }
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };
    useEffect(() => {
        setLoading(true);
        fetchData();
        fetchShop()
        setLoading(false)
    }, [selectedOption, searchQuery])
    const handleDetails = (items: any) => {
        console.log(items)
        const extractedInfo: any = [];
        items?.forEach((item: any) => {
            const orderNumber = item?.orderNumber;
            const numberOfItems = item?.numberOfItems;
            const itemProduced = item?.itemProduced;
            const itemConsumed = item?.itemConsumed;
            const Inventories = item?.inventory;
            const partName = item?.partName;
            const processName = item?.processName
            const childPartNames = item?.numberOfSlips;
            extractedInfo.push({
                "Order Number": orderNumber,
                "Number of Items": numberOfItems,
                "Child Part Names": childPartNames,
                "itemProduced": itemProduced,
                "itemConsumed": itemConsumed,
                "Inventories": Inventories,
                "partName": partName,
                "processName": processName
            });
        });
        console.log(extractedInfo);
        setInfo(extractedInfo);
        setModal(true);
        console.log(modal);
    }
    const User = ({item}: any) => {
        console.log(item);
        return (
            <FlatList
                data={item}
                renderItem={({ item: el, index }: any) => (
                    console.log(el),
                    <TouchableOpacity style={{ marginLeft: '1%', marginRight: '1.5%', borderBottomColor: 'gray', borderBottomWidth: 1, flexDirection: 'row' }} onPress={() => handleDetails(item.numberOfItem)}>
                        <View style={{ ...styles.tableData, paddingVertical: 20 }} >
                            <Text style={{ color: 'black', fontFamily: 'Inter-Medium' }}>{el?.MCode}</Text>
                        </View>
                        <View style={{ ...styles.tableData }}>
                            <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                <View style={{ flexDirection: 'column', marginTop: '10%' }}>
                                    <Text style={{ color: 'black', fontFamily: 'Inter-Medium', fontWeight: '700', fontSize: 12, alignItems: 'center' }}>
                                        {el?.partName}
                                    </Text>
                                    <Text style={{ fontWeight: '200', color: '#4b5563', fontSize: 10 }}>
                                        {el?.processName}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ ...styles.tableData, paddingVertical: 20 }}>
                            <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', alignItems: 'center' }}>
                                    {el?.numberOfItems}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...styles.tableData, paddingVertical: 20 }}>
                            <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', alignItems: 'center' }}>
                                    {el?.inventory}
                                </Text>
                            </View>
                        </View>
                        <View style={{ ...styles.tableData, paddingVertical: 20 }}>
                            <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', alignItems: 'center' }}>
                                    {el?.itemConsumed}
                                </Text>
                            </View>
                        </View>
                        {/* <TouchableOpacity style={{ ...styles.tableData, paddingVertical: 20 }} onPress={() => handleDetails(item)}>
                            <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium', alignItems: 'center', textDecorationLine: 'underline' }}>
                                    View Details
                                </Text>
                            </View>
                        </TouchableOpacity> */}
                    </TouchableOpacity>
                )}
            />
        )
    }
    const closeModal2 = () => {
        setModal(false);
    };
    if (loading) {
        return <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
        />;
    }
    // Define a function to flatten the data
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: '5%' }}>
                <Text style={{ color: 'black', fontWeight: '500', fontSize: 25 }}>Inventory</Text>
                <View style={{
                    width: '43%',
                    backgroundColor: 'white',
                    borderColor: '#DEDEDE',
                    borderRadius: 10,
                    borderWidth: 1,
                }}>
                    <Picker
                        style={{
                            color: 'black',
                            fontWeight: '600',
                        }}
                        selectedValue={selectedOption}
                        onValueChange={(itemValue: any) => setSelectedOption(itemValue)}
                    >
                        <Picker.Item label="Process" value='' />
                        {processName.map((item: any, index: any) => (
                            <Picker.Item
                                label={item.processName}
                                value={item.processName}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
            <View style={styles.searchBarContainer}>
                <Feather
                    name="search"
                    size={18}
                    color={'black'}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by component or Mcode"
                    onChangeText={text => setSearchQuery(text)}
                    value={searchQuery}
                    placeholderTextColor="gray"
                />
            </View>
            <View style={{ marginTop: '5%', maxHeight: '65%' }} >
                <ScrollView horizontal={true}>
                    <View>
                        <View style={styles.tableHeader}>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '700'
                                    }}>
                                    MCode
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '700'
                                    }}>
                                    Component
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '700'
                                    }}>
                                    Requirement
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '700'
                                    }}>
                                    Inventory
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '700'
                                    }}>
                                    Consumption
                                </Text>
                            </View>
                            {/* <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '700'
                                    }}>
                                    View Details
                                </Text>
                            </View> */}
                        </View>
                        <View style={{ maxWidth: '100%' }}>
                            <FlatList
                                data={data} // Flatten the data before renderi
                                // horizontal={true}
                                // style={{ flexDirection:'row'}}
                                keyExtractor={(item, index) => `${item.MCode}-${item.partName}-${item.processName}-${index}`} // Ensure this key is unique
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                                renderItem={({ item, index }) => (
                                    console.log(item),
                                    <View>
                                        <User item={item} />
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
            <Modal
                visible={modal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal2}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' }}>
                        <FlatList
                            data={info}
                            ListHeaderComponent={() => (
                                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000' }}>Component Details</Text>
                            )}
                            renderItem={({ item }) => (
                                <View>
                                    {[
                                        { label: 'Order Number:', value: item["Order Number"] },
                                        { label: 'Number of Items:', value: item["Number of Items"] },
                                        { label: 'Child Part Names:', value: item["Child Part Names"]},
                                        { label: 'Item Produced:', value: item["itemProduced"] },
                                        { label: 'Item Consumed:', value: item["itemConsumed"] },
                                        { label: 'Inventory:', value: item["Inventories"] },
                                        { label: 'Part Name:', value: item["partName"] },
                                        { label: 'Process Name:', value: item["processName"] },
                                    ].map((info, index) => (
                                        <View key={index}>
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000' }}>
                                                {info.label}
                                            </Text>
                                            <Text style={{ fontSize: 14, color: '#000' }}>
                                                {info.value}
                                            </Text>
                                            {index < 7}
                                        </View>
                                    ))}
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginVertical: 10 }}></View>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={() => (
                                <TouchableOpacity onPress={closeModal2} style={{ alignSelf: 'flex-end' }}>
                                    <Text style={{ color: 'blue', fontSize: 18 }}>Close</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default Inventory
const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 10,
        // marginBottom: '2%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        // marginTop: 10,
        borderWidth: 1,
        borderColor: '#DEDEDE',
        //   paddingVertical: '1%',
        marginLeft: '4%',
        //height:"10%"
    },
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
    tableHeader: {
        backgroundColor: '#ECEDFE',
        flexDirection: 'row',
        // borderRadius: 8
    },
    tableData: {
        // paddingVertical: 10,
        paddingLeft: 20,
        width: 160,
        borderRadius: 8,
        height: 55,
        // borderBottomWidth:0.3,
        // width:80
    },
    tableDataH: {
        paddingVertical: 15,
        paddingLeft: 24,
        width: 160,
        // borderRadius: 8,  
        // width:50
    },
});