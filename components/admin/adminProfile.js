import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TextInput, StyleSheet, Picker, Button, FlatList, TouchableHighlight, TouchableWithoutFeedback, StatusBar, Modal, Keyboard, ActivityIndicator } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export default function AdminProfile({ navigation }) {

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

    const [alertData, setModalVisible] = useState({
        visible: false,
        heading: '',
        message: ''
    });
    const [edit, editProfile] = useState(false);
    const [loading, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true)
        getProfileData();
    }, []);

    const getProfileData = async () => {
        let admin;
        let userToken = await AsyncStorage.getItem('userToken');
        fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/adminProfile.json?alt=media&token=f12e7e8e-1565-497c-b880-31e10259279b')
            .then((response) => response.json())
            .then((json) => {
                const item = json.admin[0][userToken];
                setProfile({
                    name: item.name,
                    address: item.address,
                    email: item.email,
                    contactNo: item.contactNo,
                    category: item.category,
                    city: item.city,
                    clientType: item.clientType,
                    locationMap: item.locationMap,
                    website: item.website,
                    socialMedia: item.socialMedia,
                    policies: item.policies
                });
                setLoader(false);
            })
            .catch((error) => console.error(error));
    }

    const updateProfile = async (values) => {
        console.log(values);
        let userToken = await AsyncStorage.getItem('userToken');
        fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/adminProfile.json?alt=media&token=f12e7e8e-1565-497c-b880-31e10259279b')
            .then((response) => response.json())
            .then((json) => {
                let oldAdminData = [];
                let newAdminData = [];
                oldAdminData = json;
                oldAdminData.admin[0][userToken] = ({
                    "id": "1",
                    "name": values.name,
                    "address": values.address,
                    "email": values.email,
                    "contactNo": values.contactNo,
                    "category": values.category,
                    "city": values.city,
                    "clientType": values.clientType,
                    "locationMap": values.locationMap,
                    "website": values.website,
                    "socialMedia": values.socialMedia,
                    "policies": values.policies
                });
                newAdminData = JSON.stringify(oldAdminData);
                fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/adminProfile.json?alt=media&token=f12e7e8e-1565-497c-b880-31e10259279b', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: newAdminData
                }).then((response) => response.json())
                    .then((json) => {
                        getProfileData();
                    })
                    .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error))
    }

    return (
        <ScreenContainer>
            <Text style={styles.heading}>Profile</Text>
            {loading ? <ActivityIndicator animating={loading} size="large" color="#2196F3" /> : !edit ? <ScrollView>
                <View style={styles.profileList}>
                    <Text>Name</Text>
                    <Text>{profile.name}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Address</Text>
                    <Text>{profile.address}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Email</Text>
                    <Text>{profile.email}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Contact No</Text>
                    <Text>{profile.contactNo}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Category</Text>
                    <Text>{profile.category}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>City</Text>
                    <Text>{profile.city}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Client Type</Text>
                    <Text>{profile.clientType}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Location</Text>
                    <Text>{profile.locationMap}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Website</Text>
                    <Text>{profile.website}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Social Media</Text>
                    <Text>{profile.socialMedia}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Policies</Text>
                    <Text>{profile.policies}</Text>
                </View>

                <TouchableWithoutFeedback onPress={() => editProfile(true)}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Edit</Text>
                        <MaterialCommunityIcons
                            name="account-edit"
                            color="#05375a"
                            size={25}
                            style={{ marginHorizontal: 10, color: 'white' }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView> :

                <Formik
                    initialValues={{
                        name: profile.name,
                        address: profile.address,
                        email: profile.email,
                        contactNo: profile.contactNo,
                        category: profile.category,
                        city: profile.city,
                        clientType: profile.clientType,
                        locationMap: profile.locationMap,
                        website: profile.website,
                        socialMedia: profile.socialMedia,
                        policies: profile.policies
                    }}
                    onSubmit={(values, actions) => {
                        console.log(values.city.trim().length)
                        if (values.name.trim().length == 0 || values.address.trim().length == 0 || values.email.trim().length == 0 || values.contactNo.trim().length == 0 || values.category.trim().length == 0 || values.city.trim().length == 0 || values.clientType.trim().length == 0) {
                            setLoader(false);
                            setModalVisible({
                                visible: true,
                                heading: 'Sorry!',
                                message: 'All fields are mandatory except Website, Social Media, Policies.'
                            });
                            return;
                        }
                        else {
                            actions.resetForm();
                            editProfile(false);
                            updateProfile(values);
                        }
                    }}
                >
                    {(props) => (
                        <ScrollView onPress={Keyboard.dismiss}>
                            <View style={styles.profileList}>
                                <Text>Name</Text>
                                <TextInput
                                    placeholder="Jane Doe"
                                    autoCapitalize="words"
                                    onChangeText={props.handleChange('name')}
                                    value={props.values.name}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Address</Text>
                                <TextInput
                                    placeholder="No, Street, City"
                                    autoCapitalize="sentences"
                                    onChangeText={props.handleChange('address')}
                                    value={props.values.address}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Email</Text>
                                <TextInput
                                    placeholder="email@hots.com"
                                    onChangeText={props.handleChange('email')}
                                    value={props.values.email}
                                    keyboardType="email-address"
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Contact No</Text>
                                <TextInput
                                    placeholder="0741234567"
                                    onChangeText={props.handleChange('contactNo')}
                                    value={props.values.contactNo}
                                    keyboardType="numeric"
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Category</Text>
                                <Picker
                                    selectedValue={props.values.category}
                                    style={{ ...styles.textInput, height: 30, width: 150 }}
                                    mode="dropdown"
                                    onValueChange={(itemValue, itemIndex) => { props.setFieldValue('category', itemValue) }}
                                >
                                    <Picker.Item label="Select an Item" value={props.values.category} />
                                    <Picker.Item label="Barber" value="Barber" />
                                    <Picker.Item label="Beauty Center" value="Beauty Center" />
                                    <Picker.Item label="Hair Saloon" value="Hair saloon" />
                                    <Picker.Item label="Make-up, Brows & Lashes" value="Make-up, Brows & Lashes" />
                                    <Picker.Item label="Massage" value="Massage" />
                                    <Picker.Item label="Spa" value="Spa" />
                                </Picker>
                                {/* <TextInput
                                    placeholder="hair saloon"
                                    onChangeText={props.handleChange('category')}
                                    value={props.values.category}
                                    style={styles.textInput}
                                /> */}
                            </View>
                            <View style={styles.profileList}>
                                <Text>City</Text>
                                <TextInput
                                    placeholder="kandy"
                                    autoCapitalize="words"
                                    onChangeText={props.handleChange('city')}
                                    value={props.values.city}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Client Type</Text>
                                <Picker
                                    selectedValue={props.values.clientType}
                                    style={{ ...styles.textInput, height: 30, width: 150 }}
                                    mode="dropdown"
                                    onValueChange={(itemValue, itemIndex) => { props.setFieldValue('clientType', itemValue) }}
                                >
                                    <Picker.Item label="Select an Item" value={props.values.clientType} />
                                    <Picker.Item label="Female" value="Female" />
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Unisex" value="Unisex" />
                                </Picker>
                                {/* <TextInput
                                    placeholder="unisex"
                                    onChangeText={props.handleChange('clientType')}
                                    value={props.values.clientType}
                                    style={styles.textInput}
                                /> */}
                            </View>
                            <View style={styles.profileList}>
                                <Text>Location</Text>
                                <TextInput
                                    placeholder="map location"
                                    onChangeText={props.handleChange('locationMap')}
                                    value={props.values.locationMap}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Website</Text>
                                <TextInput
                                    placeholder="www.site.com"
                                    onChangeText={props.handleChange('website')}
                                    value={props.values.website}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Social Media</Text>
                                <TextInput
                                    placeholder="facebook account"
                                    onChangeText={props.handleChange('socialMedia')}
                                    value={props.values.socialMedia}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Policies</Text>
                                <TextInput
                                    placeholder="my policies"
                                    autoCapitalize="sentences"
                                    onChangeText={props.handleChange('policies')}
                                    value={props.values.policies}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableWithoutFeedback onPress={() => { editProfile(false) }}>
                                    <View style={{ ...styles.button, paddingHorizontal: 15 }}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                        <MaterialCommunityIcons
                                            name="close"
                                            color="#05375a"
                                            size={25}
                                            style={{ marginHorizontal: 10, color: 'white' }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={() => { setLoader(true), props.handleSubmit() }}>
                                    <View style={{ ...styles.button, paddingHorizontal: 15 }}>
                                        <Text style={styles.buttonText}>Update</Text>
                                        <MaterialCommunityIcons
                                            name="account-check"
                                            color="#05375a"
                                            size={25}
                                            style={{ marginHorizontal: 10, color: 'white' }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </ScrollView>
                    )}
                </Formik>}

            <Modal
                animationType="none"
                transparent={true}
                visible={alertData.visible}
                onRequestClose={() => {
                    console.warn('Please close the alert first')
                }}
            >
                <View style={styles.modal}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeader}>{alertData.heading}</Text>
                        <Text style={styles.modalMessage}>{alertData.message}</Text>

                        <TouchableWithoutFeedback
                            onPress={() => {
                                setModalVisible({
                                    visible: false,
                                    heading: '',
                                    message: ''
                                });
                            }}
                        >
                            <Text style={styles.modelButton}>OK</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>

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
    profileList: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginVertical: 2,
        borderRadius: 5,
        backgroundColor: '#f5f5f5', //#f5f5f5
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