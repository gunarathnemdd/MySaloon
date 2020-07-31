import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableHighlight, TouchableWithoutFeedback, StatusBar, Modal } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

export default function WorkingHour({ navigation }) {

    const list = [
        {
            id: 1,
            day: 'Sunday',
            from: '09.00AM',
            to: '06.00PM',
            open: true
        },
        {
            id: 2,
            day: 'Monday',
            from: '09.00AM',
            to: '06.00PM',
            open: true
        },
        {
            id: 3,
            day: 'Tuesday',
            from: '09.00AM',
            to: '06.00PM',
            open: false
        },
        {
            id: 4,
            day: 'Wednesday',
            from: '09.00AM',
            to: '06.00PM',
            open: true
        },
        {
            id: 5,
            day: 'Thursday',
            from: '09.00AM',
            to: '06.00PM',
            open: true
        },
        {
            id: 6,
            day: 'Friday',
            from: '09.00AM',
            to: '06.00PM',
            open: true
        },
        {
            id: 7,
            day: 'Saturday',
            from: '09.00AM',
            to: '06.00PM',
            open: false
        },
    ]

    const [alertData, setModalVisible] = useState({
        visible: false,
        heading: '',
        message: ''
    });

    const openTimeChangeModel = (item) => {
        setModalVisible({
            ...alertData,
            visible: true
        });
    }

    return (
        <ScreenContainer>
            <Text style={styles.heading}>Working Screen</Text>
            <FlatList
                data={list}
                renderItem={({ item, index, separators }) => (
                    <TouchableHighlight
                        key={item.id}>
                        <View style={styles.itemList}>
                            <Text style={{ ...styles.item, color: 'blue' }}>{item.day}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {item.open ? <Text style={styles.item}>{item.from} - {item.to}</Text> : <Text style={{ ...styles.item, color: 'red' }}>Close</Text>}
                                <MaterialCommunityIcons
                                    name="calendar-edit"
                                    color="#05375a"
                                    size={20}
                                    style={{ marginHorizontal: 10 }}
                                    onPress={(item) => openTimeChangeModel(item)}
                                />
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
            />

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

                        <View style={{ flexDirection: 'row' }}>
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 5
    },
    itemList: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginVertical: 2,
        borderRadius: 5,
        borderBottomWidth: 1,
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
        textAlign: "center",
        marginHorizontal: 40
    }
});