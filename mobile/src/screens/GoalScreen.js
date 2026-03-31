//this captures the user's primary motivation

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';

export default function GoalScreen({ navigation }) {
    const { updateData } = useOnboarding();
    const [selectedGoal, setSelectedGoal] = useState('');

    const goals = [

        { id: 'lose_weight', label: 'Lose Weight' },
        { id: 'build_muscle', label: 'Build Muscle' },
        { id: 'improve_endurance', label: 'Improve Endurance' },
        { id: 'general_health', label: 'General Health' },

    ];

    const handleNext = () => {
        if (!selectedGoal) return;
        updateData('goal', selectedGoal);
        navigation.navigate('EmpathyResponse', { type: 'goal', choice: selectedGoal, nextScreen: 'Barrier' });
    };

    return (

        <View style={styles.container}>
            <Text style={styles.title}>What is your primary fitness goal?</Text>

            {goals.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.optionCard, selectedGoal === item.id && styles.selectedCard]} onPress={() => setSelectedGoal(item.id)}>
                    <Text style={[styles.optionText, selectedGoal === item.id && styles.selectedText]}>{item.label}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={[styles.nextButton, !selectedGoal && styles.disabledButton]} onPress={handleNext} disabled={!selectedGoal}>
                <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>

        </View>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, backgroundColor: '#FFF', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#2C3E50' },
    optionCard: { padding: 20, borderRadius: 15, backgroundColor: '#F8F9F9', borderWidth: 2, borderColor: '#EAECEE', marginBottom: 15 },
    selectedCard: { borderColor: '#3498DB', backgroundColor: '#E8F6F3' },
    optionText: { fontSize: 18, color: '#34495E', fontWeight: '500' },
    selectedText: { color: '#2980B9', fontWeight: 'bold' },
    nextButton: { backgroundColor: '#3498DB', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 40 },
    disabledButton: { backgroundColor: '#BDC3C7' },
    nextText: {
        color: '#FFF', fontSize: 18, fontWeight: 'bold'

    }
});
