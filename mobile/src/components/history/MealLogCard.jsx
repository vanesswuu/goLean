//meal log card component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MealLogCard({ item, isExpanded, onPress }) {

    return (
        <>

            <TouchableOpacity style={styles.logCard} onPress={onPress}>

                <View>
                    <Text style={styles.dateText}>{item.dateString}</Text>
                    <Text style={styles.mealCount}>{item.meals.length} Meals</Text>
                </View>

                <View style={styles.rightSection}>
                    <Text style={styles.calText}>{item.totalCals} Cals</Text>
                    <Ionicons
                        name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                        size={24}
                        color='grey'
                    />
                </View>

            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.dropdownContainer}>

                    {item.meals.map((meal, index) => (
                        <View key={meal.id || index} style={styles.mealDetailRow}>

                            <View style={styles.foodInfo}>

                                <Text style={styles.mealType}>{meal.type}</Text>

                                {(meal.food || '').split(',').map((foodItem, idx) => (
                                    <Text key={idx} style={styles.mealFood}>
                                        • {foodItem.trim()}
                                    </Text>
                                ))}
                                <Text style={styles.mealCals}>{meal.calories} kcal</Text>

                            </View>

                            <View style={styles.macrosSection}>
                                <MacroPill label="P" value={meal.p} color="#ff4757" />
                                <MacroPill label="C" value={meal.c} color="#2f3542" />
                                <MacroPill label="F" value={meal.f} color="#ffa502" />
                            </View>

                        </View>
                    ))}

                </View>
            )}


        </>
    );
}

// Helper component for macro pills
const MacroPill = ({ label, value, color }) => (
    <View style={styles.macroPill}>
        <Text style={[styles.macroLabel, { color }]}>{label}</Text>
        <Text style={styles.macroValue}>{value}g</Text>
    </View>
);


// Minimal premium style for MealLogCard
const styles = StyleSheet.create({
    logCard: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // subtle elevation for depth on Android
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    mealCount: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    calText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2ed573',
    },
    dropdownContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    mealDetailRow: {
        backgroundColor: '#fafafa',
        borderRadius: 10,
        padding: 12,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    foodInfo: { flex: 1 },
    mealType: {
        color: '#2ed573',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    mealFood: {
        fontSize: 12,
        color: '#555',
        lineHeight: 16,
    },
    mealCals: {
        color: '#333',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    macrosSection: {
        alignItems: 'flex-end',
        gap: 4,
    },
    macroPill: {
        backgroundColor: '#fff',
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    macroLabel: {
        fontSize: 9,
        fontWeight: '700',
        marginRight: 2,
        color: '#333',
    },
    macroValue: {
        fontSize: 10,
        fontWeight: '600',
        color: '#333',
    },
});

