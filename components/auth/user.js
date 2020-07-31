import React, { useState, useEffect } from 'react';
import {
    Button,
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    Alert,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';

import { AuthContext } from "../context";

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export default function User({ navigation }) {

    return (
        <ScreenContainer>
            <Text style={styles.heading}>Sign In as</Text>
            <TouchableWithoutFeedback onPress={() => navigation.push("SignInPage", { loginType: "admin" })}><View style={styles.button}><Text style={styles.buttonText}>Shop</Text></View></TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => navigation.push("SignInPage", { loginType: "user" })}><View style={styles.button}><Text style={styles.buttonText}>Customer</Text></View></TouchableWithoutFeedback>
            {/* <Button style={styles.button} title="Shop" onPress={() => navigation.push("SignInPage", { loginType: "admin" })} />
            <Button style={styles.button} title="Customer" onPress={() => navigation.push("SignInPage", { loginType: "user" })} /> */}
        </ScreenContainer>
    );
};

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
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 5, 
        backgroundColor: '#2196F3',
        alignItems: "center",
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    }
});