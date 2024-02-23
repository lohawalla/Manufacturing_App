import React, { useState } from 'react';
import { View, Text, TouchableOpacity,Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ImageIndex } from '../../assets/AssetIndex';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const Accordion = ({ data, text, type }: any) => {
    console.log(type);
    const [expanded, setExpanded] = useState(false);
    console.log(data);
    const toggleAccordion = () => {
        setExpanded(!expanded);
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleAccordion}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{fontSize:20}}>{text=='IDLE'?"निष्क्रिय":"सक्रिय"} {type=='EMPLOYEES'?"कर्मचारी":"मशीनों"}</Text>
                    <Feather
                        name={expanded ? "chevron-down" : "chevron-up"}
                        size={18}
                        color={'black'}
                        style={{ marginLeft: 5 }}
                    /></View>
                {expanded && (
                    <View style={{ marginTop: 16, marginLeft: 12 }}>
                        {data?.length > 0 ? (
                            data.map((item: any, index: number) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    {/* Conditionally display a dummy image if text is "employees" */}
                                    {type === 'EMPLOYEES' && (
                                        <Image
                                        source={{ uri: "https://cdn-icons-png.flaticon.com/512/3789/3789820.png" }}
                                        style={{
                                            width: responsiveHeight(8),
                                            height: responsiveHeight(8),
                                            borderRadius: responsiveHeight(10),
                                        }}
                                    />
                                    )}
                                    {type === 'MACHINES' && (
                                        <Image
                                        source={{ uri: "https://cdn.dribbble.com/users/1179255/screenshots/3869804/media/128901c4ce0bbbe670bfb35a6b204b93.png?resize=400x300&vertical=center" }}
                                        style={{
                                            width: responsiveHeight(8),
                                            height: responsiveHeight(8),
                                            borderRadius: responsiveHeight(10),
                                        }}
                                    />
                                    )}
                                    <Text>&#8226; {item.machineName || item.employeeName}</Text>
                                </View>
                            ))
                        ) : (
                            <View>
                                <Text style={{ color: '#2E2E2E', fontWeight: '700', fontSize: 18, lineHeight: 22.4, fontFamily: 'inter' }}>
                                    Your {type=='EMPLOYEES'?"कर्मचारी":"मशीनों"} are Empty
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default Accordion;
