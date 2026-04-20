import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';

export default function ActivityScreen({ navigation }) {
    const { updateData } = useOnboarding();
    const [selectedActivity, setSelectedActivity] = useState('');

    const activities = [
        { id: 'sedentary', label: 'Sedentary (mostly sitting)' },
        { id: 'lightly_active', label: 'Lightly Active (some walking)' },
        { id: 'moderately_active', label: 'Moderately Active (exercise 3-5 days/week)' },
        { id: 'very_active', label: 'Very Active (intense exercise daily)' },
    ];

    const handleNext = () => {
        if (!selectedActivity) return;
        updateData('activityLevel', selectedActivity);
        navigation.navigate('EmpathyResponse', { type: 'activityLevel', choice: selectedActivity, nextScreen: 'Metrics' });
    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>How active are you currently?</Text>
            {activities.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.optionCard, selectedActivity === item.id && styles.selectedCard]} onPress={() => setSelectedActivity(item.id)}>
                    <Text style={[styles.optionText, selectedActivity === item.id && styles.selectedText]}>{item.label}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={[styles.nextButton, !selectedActivity && styles.disabledButton]} onPress={handleNext} disabled={!selectedActivity}>
                <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>

        </View>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, backgroundColor: '#FFF', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#2C3E50' },
    optionCard: { padding: 20, borderRadius: 15, backgroundColor: '#F8F9F9', borderWidth: 2, borderColor: '#EAECEE', marginBottom: 15 },
    selectedCard: { borderColor: '#27AE60', backgroundColor: '#EAFAF1' },
    optionText: { fontSize: 18, color: '#34495E', fontWeight: '500' },
    selectedText: { color: '#1E8449', fontWeight: 'bold' },
    nextButton: { backgroundColor: '#3498DB', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 40 },
    disabledButton: { backgroundColor: '#BDC3C7' },
    nextText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
