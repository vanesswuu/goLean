import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EmpathyResponses } from '../constants/responseText';

export default function EmpathyResponseScreen({ route, navigation }) {
    const { type, choice, nextScreen } = route.params;

    const responseText = EmpathyResponses[type]?.[choice] || "We're here to support you every step of the way.";



    return (
        <View style={styles.container}>

            <Text style={styles.responseText}>{responseText}</Text>

            <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate(nextScreen)}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EAECEE', padding: 30 },
    responseText: { fontSize: 26, fontWeight: '500', color: '#2C3E50', textAlign: 'center', lineHeight: 36, marginBottom: 40 },
    continueButton: {
        marginTop: 60,
        backgroundColor: '#3498DB',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25
    }, buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
