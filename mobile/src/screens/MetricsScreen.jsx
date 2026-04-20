import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';

export default function MetricsScreen({ navigation }) {
    const { updateData } = useOnboarding();

    // Notice we added a gender hook!
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    const canSubmit = gender !== '' && age.length > 0 && weight.length > 0 && height.length > 0;

    const handleNext = () => {
        if (!canSubmit) return;
        updateData('gender', gender);
        updateData('age', age);
        updateData('weight', weight);
        updateData('height', height);
        navigation.navigate('Summary');
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>

            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.title}>Let's get your vital stats</Text>
                <Text style={styles.subtitle}>Our algorithm uses this data to instantly calculate your exact caloric needs.</Text>

                <View style={styles.inputGroup}>

                    <Text style={styles.label}>Biological Sex</Text>

                    <View style={styles.genderRow}>

                        <TouchableOpacity style={[styles.genderButton, gender === 'male' && styles.selectedGender]} onPress={() => setGender('male')}>
                            <Text style={[styles.genderText, gender === 'male' && styles.selectedGenderText]}>Male</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.genderButton, gender === 'female' && styles.selectedGender]} onPress={() => setGender('female')}>
                            <Text style={[styles.genderText, gender === 'female' && styles.selectedGenderText]}>Female</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Age (years)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} placeholder="e.g. 25" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="e.g. 70" />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="e.g. 175" />
                </View>

                <TouchableOpacity style={[styles.nextButton, !canSubmit && styles.disabledButton]} onPress={handleNext} disabled={!canSubmit}>
                    <Text style={styles.nextText}>Calculate Daily Calorie Intake Goal</Text>
                </TouchableOpacity>

            </ScrollView>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 30, paddingTop: 20, backgroundColor: '#FFF' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#2C3E50' },
    subtitle: { fontSize: 16, color: '#7F8C8D', marginBottom: 20, lineHeight: 22 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#34495E', marginBottom: 8 },
    input: { borderWidth: 2, borderColor: '#EAECEE', borderRadius: 15, padding: 15, fontSize: 18, backgroundColor: '#F8F9F9', color: '#2C3E50' },
    genderRow: { flexDirection: 'row', justifyContent: 'space-between' },
    genderButton: { flex: 1, borderWidth: 2, borderColor: '#EAECEE', borderRadius: 15, padding: 15, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#F8F9F9' },
    selectedGender: { borderColor: '#3498DB', backgroundColor: '#E8F6F3' },
    genderText: { fontSize: 18, color: '#34495E', fontWeight: '500' },
    selectedGenderText: { color: '#2980B9', fontWeight: 'bold' },
    nextButton: { backgroundColor: '#3498DB', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 10 },
    disabledButton: { backgroundColor: '#BDC3C7' },
    nextText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
