import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TextInput, StyleSheet, Picker, Button, FlatList, TouchableHighlight, TouchableWithoutFeedback, StatusBar, Modal, Keyboard, ActivityIndicator } from "react-native";
import { Avatar } from 'react-native-elements';
//import { Avatar } from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export default function Services({ navigation }) {

    const [profile, setProfile] = useState({
        name: '',
        address: '',
        email: '',
        contactNo: '',
        category: '',
        city: '',
        clientType: '',
        locationMap: '',
        website: '',
        socialMedia: '',
        policies: ''
    });

    const [data, setData] = useState({
        status: false,
        members: []
    });
    const [loading, setLoader] = useState(false);

    useEffect(() => {
        navigation.addListener('focus', () => {
            setLoader(true);
            getProfileData();
        });
    }, []);

    const getProfileData = async () => {
        let admin;
        let userToken = await AsyncStorage.getItem('userToken');
        fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/staff.json?alt=media&token=8304b318-8f20-449a-b907-cb3dbc9c0290')
            .then((response) => response.json())
            .then((json) => {
                const item = json.staff[0][userToken];
                //console.log(typeof item, item, Object.keys(item).length)
                //{ typeof item != "undefined" ? setData({ status: true, members: item }) : setData({ ...data, status: false }) }
                { Object.keys(item).length > 0 ? setData({ status: true, members: item }) : setData({ ...data, status: false }) }
                setLoader(false);
            })
            .catch((error) => console.error(error));
    }

    const navigateToStaffDetails = async (item) => {
        if (!item) {
            data['name'] = 'Add New Member';
            navigation.push("Staff Details", { data: data, addNewMember: true });
        }
        else {
            const position = data.members.map(function (e) { return e.id; }).indexOf(item.id);
            navigation.push("Staff Details", { data: item, addNewMember: false, position: position });
        }
    }

    const renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "green",
                    marginLeft: "20%",
                    marginBottom: 10
                }}
            />
        );
    };

    return (
        <ScreenContainer>
            <Text style={styles.heading}>Staff</Text>
            {loading ? <ActivityIndicator animating={loading} size="large" color="#2196F3" /> : !data.status ? <Text style={styles.heading}>No staff members. Please add members.</Text> : <FlatList
                data={data.members}
                renderItem={({ item, index, separators }) => (
                    <TouchableWithoutFeedback
                        key={item.id}
                        onPress={() => navigateToStaffDetails(item)}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <Avatar
                                rounded
                                size="medium"
                                title={item.name[0]}
                                source={{
                                    uri: item.image
                                }}
                                containerStyle={{ marginTop: 5 }}
                            />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%" }}>
                                <View style={styles.itemList}>
                                    {/* style={styles.itemList} */}
                                    <Text style={{ ...styles.item, color: 'blue' }}>{item.name}</Text>
                                    <Text style={{ ...styles.item }}>{item.contactNo}</Text>
                                    <Text style={{ ...styles.item }}>{item.type}</Text>
                                </View>
                                <View>
                                    <MaterialCommunityIcons
                                        name="chevron-right"
                                        color="#05375a"
                                        size={50}
                                        style={{ marginHorizontal: 10 }}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )}
                LisHeaderComponent={<></>}
                ListFooterComponent={<></>}
                ItemSeparatorComponent={renderSeparator}
            />}

            <ActionButton
                buttonColor="rgba(231,76,60,1)"
                onPress={() => navigateToStaffDetails(false)}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 20,
        marginTop: StatusBar.currentHeight || 0,
    },
    heading: {
        textAlign: "center",
        marginBottom: 10
    },
    button: {
        flexDirection: 'row',
        paddingVertical: 15,
        marginVertical: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#2196F3',
        justifyContent: "center",
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    textInput: {
        color: 'red'
    },
    itemList: {
        marginLeft: 10,
        paddingBottom: 10,
        backgroundColor: '#f5f5f5',
    },
    item: {
        fontSize: 15
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modal: {
        flex: 1,
        justifyContent: "center"
    },
    modalHeader: {
        marginVertical: 20,
        fontSize: 20,
        color: 'red',
        textAlign: "center"
    },
    modalMessage: {
        textAlign: "center"
    },
    modelButton: {
        marginTop: 30,
        marginBottom: 20,
        color: "blue",
        fontWeight: "bold",
        textAlign: "center"
    }
});