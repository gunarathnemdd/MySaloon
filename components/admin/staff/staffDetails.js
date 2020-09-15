import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TextInput, StyleSheet, Picker, Button, FlatList, CheckBox, TouchableWithoutFeedback, StatusBar, Modal, Keyboard, ActivityIndicator, Image, DatePickerIOSBase } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Avatar } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { Formik } from 'formik';
import { setStatusBarBackgroundColor } from "expo-status-bar";

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export default function StaffDetails({ route, navigation }) {

    const [profile, setProfile] = useState({
        name: '',
        address: '',
        email: '',
        contactNo: '',
        gender: '',
        type: '',
        idNo: '',
        joinDate: Date.now(),
        resignDate: Date.now(),
        currentEmployee: true,
        services: '',
        image: 'unknown'
    });

    const [alertData, setModalVisible] = useState({
        visible: false,
        heading: '',
        message: ''
    });
    const [edit, editProfile] = useState(false);
    const [loading, setLoader] = useState(false);
    const [position, setPosition] = useState(null);
    const [addNewMember, setAddNewMember] = useState(false);
    const [image, setImage] = useState(null);
    const [date, setDate] = useState({ joinDate: null, resignDate: null });
    const [timeModal, setTimeModal] = useState({ joinTime: false, resignTime: false });
    const [month, setMonth] = useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    const [btnIcn, setBtnIcn] = useState({
        button: 'Update',
        icon: 'account-check'
    })

    useEffect(() => {
        setLoader(true);
        console.log('hghghg', profile.name[0])
        if (route.params.addNewMember) {
            setAddNewMember(route.params.addNewMember);
            editProfile(true);
            setLoader(false);
            setBtnIcn({
                button: 'Add',
                icon: 'account-plus'
            })
        }
        else {
            setPosition(route.params.position);
            getProfileData(route.params.data);
        }
    }, []);

    const getProfileData = async (data) => {
        let admin;
        let userToken = await AsyncStorage.getItem('userToken');
        setProfile({
            name: data.name,
            address: data.address,
            email: data.email,
            contactNo: data.contactNo,
            gender: data.gender,
            type: data.type,
            idNo: data.idNo,
            joinDate: data.joinDate,
            resignDate: data.resignDate,
            currentEmployee: data.currentEmployee,
            services: data.services,
            image: data.image
        });
        setLoader(false);
        let firstDate = new Date(data.joinDate) //.toString();
        let joinDate = firstDate.getFullYear() + ' ' + month[firstDate.getMonth()] + ' ' + firstDate.getDate();
        let lastDate = new Date(data.resignDate) //.toString();
        let resignDate = lastDate.getFullYear() + ' ' + month[lastDate.getMonth()] + ' ' + lastDate.getDate();
        setDate({ joinDate: joinDate, resignDate: resignDate });
    }

    const addNewProfile = async (values) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let imageUri = image ? `data:image/png;base64,${image.base64}` : null;
        fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/staff.json?alt=media&token=8304b318-8f20-449a-b907-cb3dbc9c0290')
            .then((response) => response.json())
            .then((json) => {
                let oldStaffData = [];
                let newStaffData = [];
                oldStaffData = json;
                let id = Object.keys(oldStaffData.staff[0][userToken]).length + 1;
                oldStaffData.staff[0][userToken].push({
                    "id": id,
                    "name": values.name,
                    "address": values.address,
                    "email": values.email,
                    "contactNo": values.contactNo,
                    "gender": values.gender,
                    "type": values.type,
                    "idNo": values.idNo,
                    "joinDate": values.joinDate,
                    "resignDate": values.resignDate,
                    "currentEmployee": values.currentEmployee,
                    "services": values.services,
                    "image": values.image
                });
                newStaffData = JSON.stringify(oldStaffData);
                fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/staff.json?alt=media&token=8304b318-8f20-449a-b907-cb3dbc9c0290', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: newStaffData
                }).then((response) => response.json())
                    .then((json) => {
                        setLoader(false);
                        setBtnIcn({
                            button: 'Update',
                            icon: 'account-check'
                        })
                        //getProfileData(values);
                        navigation.popToTop()
                    })
                    .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error))
    }

    const updateProfile = async (values) => {
        let userToken = await AsyncStorage.getItem('userToken');
        let imageUri = image ? `data:image/png;base64,${image.base64}` : null;
        fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/staff.json?alt=media&token=8304b318-8f20-449a-b907-cb3dbc9c0290')
            .then((response) => response.json())
            .then((json) => {
                let oldStaffData = [];
                let newStaffData = [];
                let id = position + 1;
                oldStaffData = json;
                oldStaffData.staff[0][userToken][position] = ({
                    "id": id.toString(),
                    "name": values.name,
                    "address": values.address,
                    "email": values.email,
                    "contactNo": values.contactNo,
                    "gender": values.gender,
                    "type": values.type,
                    "idNo": values.idNo,
                    "joinDate": values.joinDate,
                    "resignDate": values.resignDate,
                    "currentEmployee": values.currentEmployee,
                    "services": values.services,
                    "image": values.image
                });
                newStaffData = JSON.stringify(oldStaffData);
                fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/staff.json?alt=media&token=8304b318-8f20-449a-b907-cb3dbc9c0290', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: newStaffData
                }).then((response) => response.json())
                    .then((json) => {
                        setLoader(false);
                        getProfileData(values);
                        //navigation.popToTop()
                    })
                    .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error))
    }

    const pickImage = async (handleChange) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                base64: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {

            }
            //handleChange(`data:image/png;base64,${result.base64}`);
            handleChange(result.uri);
            setImage(result);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <ScreenContainer>
            {loading ? <ActivityIndicator animating={loading} size="large" color="#2196F3" /> : !edit ? <ScrollView><View style={{ alignItems: "center", marginVertical: 2, paddingVertical: 10 }}>
                <Avatar
                    rounded
                    size="xlarge"
                    title={profile.name[0]}
                    source={{
                        uri: profile.image
                    }}
                /></View>
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
                    <Text>Gender</Text>
                    <Text>{profile.gender}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Type</Text>
                    <Text>{profile.type}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>ID Number</Text>
                    <Text>{profile.idNo}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Join Date</Text>
                    <Text>{date.joinDate}</Text>
                </View>
                <View style={styles.profileList}>
                    <Text>Resign Date</Text>
                    {profile.currentEmployee ? <Text>Current employee</Text> : <Text>{date.resignDate}</Text>}
                </View>
                <View style={styles.profileList}>
                    <Text>Services</Text>
                    <Text>{profile.services}</Text>
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
                        gender: profile.gender,
                        type: profile.type,
                        idNo: profile.idNo,
                        joinDate: profile.joinDate,
                        resignDate: profile.resignDate,
                        currentEmployee: profile.currentEmployee,
                        services: profile.services,
                        image: profile.image
                    }}
                    onSubmit={(values, actions) => {
                        //setLoader(false);
                        if (values.name.trim().length == 0 || values.address.trim().length == 0 || values.email.trim().length == 0 || values.contactNo.trim().length == 0 || values.gender.trim().length == 0 || values.type.trim().length == 0 || values.idNo.trim().length == 0) {
                            setLoader(false);
                            setModalVisible({
                                visible: true,
                                heading: 'Sorry!',
                                message: 'All fields are mandatory except Join Date, Resign Date, Services and Image.'
                            });
                        }
                        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.trim())) {
                            setLoader(false);
                            setModalVisible({
                                visible: true,
                                heading: 'Sorry!',
                                message: 'Email format is wrong.'
                            });
                        }
                        else if (new Date(values.resignDate) < new Date(values.joinDate)) {
                            setLoader(false);
                            setModalVisible({
                                visible: true,
                                heading: 'Sorry!',
                                message: 'Resign date should be after Join date.'
                            });
                        }
                        else {
                            if (addNewMember) {
                                actions.resetForm();
                                //editProfile(false);
                                addNewProfile(values)
                            }
                            else {
                                actions.resetForm();
                                editProfile(false);
                                updateProfile(values);
                            }
                        }
                    }}
                >
                    {(props) => (
                        <ScrollView onPress={Keyboard.dismiss}>
                            <View style={{ alignItems: "center", marginVertical: 2, paddingVertical: 10 }}>
                                <Avatar
                                    rounded
                                    size="xlarge"
                                    title={profile.name[0]}
                                    source={{
                                        uri: props.values.image
                                    }}
                                    showAccessory={true}
                                    onAccessoryPress={() => pickImage(props.handleChange('image'))}
                                />
                            </View>
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
                                <Text>Gender</Text>
                                <Picker
                                    selectedValue={props.values.gender}
                                    style={{ ...styles.textInput, height: 30, width: 150 }}
                                    mode="dropdown"
                                    onValueChange={(itemValue, itemIndex) => { props.setFieldValue('gender', itemValue) }}
                                >
                                    <Picker.Item label="Select an Item" value={props.values.gender} />
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                </Picker>
                                {/* <TextInput
                                    placeholder="hair saloon"
                                    onChangeText={props.handleChange('category')}
                                    value={props.values.category}
                                    style={styles.textInput}
                                /> */}
                            </View>
                            <View style={styles.profileList}>
                                <Text>Type</Text>
                                <Picker
                                    selectedValue={props.values.type}
                                    style={{ ...styles.textInput, height: 30, width: 150 }}
                                    mode="dropdown"
                                    onValueChange={(itemValue, itemIndex) => { props.setFieldValue('type', itemValue) }}
                                >
                                    <Picker.Item label="Select an Item" value={props.values.type} />
                                    <Picker.Item label="Admin" value="Admin" />
                                    <Picker.Item label="Secretary" value="Secretary" />
                                    <Picker.Item label="Staff" value="Staff" />
                                </Picker>
                                {/* <TextInput
                                    placeholder="staff"
                                    autoCapitalize="words"
                                    onChangeText={props.handleChange('type')}
                                    value={props.values.type}
                                    style={styles.textInput}
                                /> */}
                            </View>
                            <View style={styles.profileList}>
                                <Text>ID Number</Text>
                                <TextInput
                                    placeholder="0000000000"
                                    onChangeText={props.handleChange('idNo')}
                                    value={props.values.idNo}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={styles.profileList}>
                                <Text>Join Date</Text>
                                {/* <TextInput
                                    placeholder="2000-05-23"
                                    onChangeText={props.handleChange('joinDate')}
                                    value={props.values.joinDate}
                                    style={styles.textInput}
                                /> */}
                                <Text style={styles.textInput} onPress={() => setTimeModal({ ...timeModal, joinTime: true })}>{new Date(props.values.joinDate).getFullYear() + ' ' + month[new Date(props.values.joinDate).getMonth()] + ' ' + new Date(props.values.joinDate).getDate()}</Text>
                                {timeModal.joinTime ? <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date(props.values.joinDate)}
                                    mode="date"
                                    display="spinner"
                                    onChange={(e, date) => { date !== undefined ? (setTimeModal({ ...timeModal, joinTime: false }), props.setFieldValue('joinDate', new Date(date))) : setTimeModal({ ...timeModal, joinTime: false }) }}
                                /> : null}
                            </View>
                            {/* props.setFieldValue('joinDate', new Date(date)) */}
                            <View style={styles.profileList}>
                                <Text>Resign Date</Text>
                                {/* <TextInput
                                    placeholder="2020-04-12"
                                    onChangeText={props.handleChange('resignDate')}
                                    value={props.values.resignDate}
                                    style={styles.textInput}
                                /> */}
                                <View>
                                    {/* <CheckBox
                                        center
                                        title='Current Employee'
                                        iconRight
                                        iconType='material'
                                        checkedIcon='clear'
                                        uncheckedIcon='add'
                                        checkedColor='red'
                                        checked={props.values.currentEmployee}
                                        onPress={() => props.setFieldValue('currentEmployee', !props.values.currentEmployee)}
                                    /> */}
                                    <View style={{ flexDirection: "row" }}>
                                        <CheckBox
                                            value={props.values.currentEmployee}
                                            onValueChange={() => props.setFieldValue('currentEmployee', !props.values.currentEmployee)}
                                            style={styles.checkbox}
                                        />
                                        <Text style={styles.checkbox}>Current employee</Text>
                                    </View>
                                    {props.values.currentEmployee ? <Text style={{ ...styles.textInput, textDecorationLine: "line-through" }}>{new Date(props.values.resignDate).getFullYear() + ' ' + month[new Date(props.values.resignDate).getMonth()] + ' ' + new Date(props.values.resignDate).getDate()}</Text> :
                                        <Text style={styles.textInput} onPress={() => setTimeModal({ ...timeModal, resignTime: true })}>{new Date(props.values.resignDate).getFullYear() + ' ' + month[new Date(props.values.resignDate).getMonth()] + ' ' + new Date(props.values.resignDate).getDate()}</Text>}
                                </View>
                                {timeModal.resignTime ? <DateTimePicker
                                    testID="dateTimePicker"
                                    value={new Date(props.values.resignDate)}
                                    mode="date"
                                    display="spinner"
                                    onChange={(e, date) => { date !== undefined ? (setTimeModal({ ...timeModal, resignTime: false }), props.setFieldValue('resignDate', new Date(date))) : setTimeModal({ ...timeModal, resignTime: false }) }}
                                /> : null}
                            </View>
                            <View style={styles.profileList}>
                                <Text>Services</Text>
                                <TextInput
                                    placeholder="barber"
                                    autoCapitalize="sentences"
                                    onChangeText={props.handleChange('services')}
                                    value={props.values.services}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableWithoutFeedback onPress={() => { addNewMember ? navigation.push("Staff") : editProfile(false) }}>
                                    <View style={{ ...styles.button, width: '40%' }}>
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
                                    <View style={{ ...styles.button, width: '40%' }}>
                                        <Text style={styles.buttonText}>{btnIcn.button}</Text>
                                        <MaterialCommunityIcons
                                            name={btnIcn.icon}
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
        color: 'red',
        textAlign: "right"
    },
    checkbox: {
        alignSelf: "center",
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
    tags: {
        padding: 5,
        backgroundColor: "lightblue",
        marginHorizontal: 5,
        borderRadius: 10
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