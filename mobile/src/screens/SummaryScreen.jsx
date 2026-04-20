import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useOnboarding } from '../context/OnboardingContext';
import { calculateNutrition } from '../utils/calculations';

export default function SummaryScreen({ navigation }) {
    const { onboarding } = useOnboarding();

    // The magical math engine runs here instantly using their choices!
    const plan = calculateNutrition(
        onboarding.age,
        onboarding.weight,
        onboarding.height,
        onboarding.gender,
        onboarding.activityLevel,
        onboarding.goal
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Your Custom Plan is Ready!</Text>

            {/* The Big Bold Calorie Target Box */}
            <View style={styles.heroCard}>
                <Text style={styles.heroLabel}>Daily Calorie Target</Text>
                <Text style={styles.heroValue}>{plan.calories} <Text style={styles.kcalText}>kcal</Text></Text>
            </View>

            {/* The 3 Macro Boxes side by side */}
            <View style={styles.macroContainer}>
                <View style={[styles.macroCard, { borderTopColor: '#E74C3C' }]}>
                    <Text style={styles.macroValue}>{plan.protein}g</Text>
                    <Text style={styles.macroLabel}>Protein</Text>
                </View>

                <View style={[styles.macroCard, { borderTopColor: '#F1C40F' }]}>
                    <Text style={styles.macroValue}>{plan.carbs}g</Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                </View>

                <View style={[styles.macroCard, { borderTopColor: '#3498DB' }]}>
                    <Text style={styles.macroValue}>{plan.fats}g</Text>
                    <Text style={styles.macroLabel}>Fats</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.finishButton} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.finishText}>Save and Go to Account Setup</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 30, backgroundColor: '#FFF', justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 40, color: '#2C3E50', textAlign: 'center' },

    heroCard: { backgroundColor: '#2C3E50', padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
    heroLabel: { color: '#BDC3C7', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
    heroValue: { color: '#2ECC71', fontSize: 48, fontWeight: '900' },
    kcalText: { fontSize: 20, color: '#FFF', fontWeight: '400' }, // Smaller font size for kcal to make the number pop

    macroContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    macroCard: { flex: 1, backgroundColor: '#F8F9F9', padding: 20, borderRadius: 15, alignItems: 'center', marginHorizontal: 5, borderTopWidth: 5 },
    macroValue: { fontSize: 22, fontWeight: '900', color: '#2C3E50', marginBottom: 5 },
    macroLabel: { fontSize: 14, color: '#7F8C8D', fontWeight: 'bold' },

    finishButton: { backgroundColor: '#27AE60', padding: 20, borderRadius: 30, alignItems: 'center' },
    finishText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
