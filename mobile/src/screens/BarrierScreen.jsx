import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';



export default function BarrierScreen({ navigation }) {

    const { updateData } = useOnboarding();
    const [selectedBarrier, setSelectedBarrier] = useState('');

    const barriers = [
        { id: 'time', label: 'Lack of time' },
        { id: 'knowledge', label: 'Not sure what to do' },
        { id: 'motivation', label: 'Hard to stay motivated' },
        { id: 'energy', label: 'Low energy after work' }
    ];

    const handleNext = () => {
        if (!selectedBarrier) return;
        updateData('barrier', selectedBarrier);
        navigation.navigate('EmpathyResponse', {
            type: 'barrier',
            choice: selectedBarrier,
            nextScreen: 'Activity'
        });
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>What usually holds you back?</Text>

            {barriers.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.optionCard, selectedBarrier === item.id && styles.selectedCard]}
                    onPress={() => setSelectedBarrier(item.id)}>
                    <Text style={[styles.optionText, selectedBarrier === item.id && styles.selectedText]}>{item.label}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={[styles.nextButton, !selectedBarrier && styles.disabledButton]} onPress={handleNext} diabled={!selectedBarrier}>
                <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>

        </View>

    );

}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, backgroundColor: '#FFF', justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#2C3E50' },
    optionCard: { padding: 20, borderRadius: 15, backgroundColor: '#F8F9F9', borderWidth: 2, borderColor: '#EAECEE', marginBottom: 15 },
    selectedCard: { borderColor: '#E74C3C', backgroundColor: '#FDEDEC' },
    optionText: { fontSize: 18, color: '#34495E', fontWeight: '500' },
    selectedText: { color: '#C0392B', fontWeight: 'bold' },
    nextButton: { backgroundColor: '#3498DB', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 40 },
    disabledButton: { backgroundColor: '#BDC3C7' },
    nextText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});