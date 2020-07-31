import React, { useState, useEffect } from 'react';
import {
    Button,
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    Alert,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';

import { AuthContext } from "../context";

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export default function SignInPage({ navigation, route }) {
    const { signIn } = React.useContext(AuthContext);

    const [alertData, setModalVisible] = useState({
        visible: false,
        heading: '',
        message: ''
    });

    const [data, setData] = React.useState({
        loginType: route.params.loginType
    });

    const [loading, setLoader] = useState(false);

    const loginHandle = (values) => {

        if (values.username.trim().length == 0 || values.password.trim().length == 0) {
            setLoader(false);
            setModalVisible({
                visible: true,
                heading: 'Sorry!',
                message: 'Username or Password field cannot be empty.'
            });
            return;
        }

        fetch('https://firebasestorage.googleapis.com/v0/b/test-9cd65.appspot.com/o/auth.json?alt=media&token=c83ba919-6d35-4cdc-bb79-d765b657b9f1')
            .then((response) => response.json())
            .then((json) => {
                const foundUser = json.users.filter(item => {
                    return values.username.trim() == item.username && values.password.trim() == item.password && data.loginType == item.type
                });

                if (foundUser.length == 0) {
                    setLoader(false);
                    setModalVisible({
                        visible: true,
                        heading: 'Sorry!',
                        message: 'Usename or Password is incorrect.'
                    });
                    return;
                }

                //setLoader(false);
                signIn(foundUser);
            })
            .catch((error) => console.error(error))
    }

    return (
        <ScreenContainer>
            <Text style={styles.heading}>{data.loginType}</Text>
            {loading ? <ActivityIndicator animating={loading} size="large" color="#2196F3" /> : <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                onSubmit={(values, actions) => {
                    actions.resetForm();
                    loginHandle(values);
                }}
            >
                {(props) => (
                    <View onPress={Keyboard.dismiss}>
                        <Text>Username</Text>
                        <View style={styles.inputRow}>
                            <MaterialCommunityIcons
                                name="account"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Username"
                                autoCapitalize="sentences"
                                onChangeText={props.handleChange('username')}
                                value={props.values.username}
                                style={styles.textInput}
                            />
                        </View>
                        <Text>Password</Text>
                        <View style={styles.inputRow}>
                            <MaterialCommunityIcons
                                name="lock"
                                color="#05375a"
                                size={20}
                            />
                            <TextInput
                                placeholder="Password"
                                onChangeText={props.handleChange('password')}
                                value={props.values.password}
                                secureTextEntry={true}
                                style={styles.textInput}
                            />
                        </View>

                        <TouchableWithoutFeedback onPress={() => { setLoader(true), props.handleSubmit() }}>
                            <View style={{ ...styles.button, paddingHorizontal: 15 }}>
                                <Text style={styles.buttonText}>Sign In</Text>
                                <MaterialCommunityIcons
                                    name="login"
                                    color="#05375a"
                                    size={25}
                                    style={{ marginHorizontal: 10, color: 'white' }}
                                />
                            </View>
                        </TouchableWithoutFeedback>

                        {data.loginType == 'admin' ? null :
                            <View><Text style={styles.heading}>Don't have an Account</Text>
                                <Text style={{ ...styles.heading, color: 'blue' }} onPress={() => navigation.push("SignUpPage", { signupType: data.loginType })}>Create an Account</Text>
                            </View>}

                    </View>
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
        marginHorizontal: 50,
    },
    heading: {
        textAlign: "center",
        marginBottom: 10
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15,
        marginVertical: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#2196F3',
        alignItems: "center",
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    inputRow: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2196F3',
        marginBottom: 20
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
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