import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';

export default function NameScreen({ navigation }) {

    const { updateData } = useOnboarding();
    const [name, setName] = useState('');

    const handleNext = () => {
        if (!name.trim()) return; //can check if the input is empty or just spaces
        updateData('name', name);
        navigation.navigate('Goal');
    }

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.os === 'ios' ? 'padding' : 'height'}>

            <Text style={styles.title}>Welcome! What should we call you?</Text>
            <TextInput
                style={styles.input}
                placeholder='Your first name'
                value={name}
                onChangeText={setName}
                autoFocus={true}
            />

            <TouchableOpacity style={[styles.nextButton, !name.trim() && styles.disabledButton]}
                onPress={handleNext} disabled={!name.trim()}>

                <Text style={styles.nextText}>Next</Text>

            </TouchableOpacity>


        </KeyboardAvoidingView>

    )

}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, backgroundColor: '#FFF', justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: '#2C3E50', lineHeight: 40 },
    input: { borderWidth: 2, borderColor: '#3498DB', borderRadius: 15, padding: 18, fontSize: 20, backgroundColor: '#E8F6F3', color: '#2C3E50', marginBottom: 30 },
    nextButton: { backgroundColor: '#3498DB', padding: 18, borderRadius: 30, alignItems: 'center' },
    disabledButton: { backgroundColor: '#BDC3C7' },
    nextText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
