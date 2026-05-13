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


const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    logCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        margin: 2,
        shadowOffset: { width: 0, height: 4 },
    },
    expandedCard: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        elevation: 2,
    },
    dateText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#2f3542'
    },
    mealCount: {
        fontSize: 12,
        color: '#a4b0be',
        marginTop: 4,
        fontWeight: '600'
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    calText: {
        fontSize: 24,
        fontWeight: '900',
        color: '#2ed573'
    },
    calUnit: {
        fontSize: 12,
        color: '#a4b0be',
        fontWeight: '600'
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#f1f2f6',
        elevation: 2,
    },
    mealDetailRow: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        padding: 15,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    foodInfo: {
        flex: 1,
    },
    mealType: {
        color: '#2ed573',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4
    },
    mealFood: {
        fontSize: 13,
        color: '#57606f',
        lineHeight: 18
    },
    mealCals: {
        color: '#2f3542',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4
    },
    macrosSection: {
        gap: 6,
        alignItems: 'flex-end',
    },
    macroPill: {
        backgroundColor: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 60,
        borderWidth: 1,
        borderColor: '#f1f2f6'
    },
    macroLabel: {
        fontSize: 10,
        fontWeight: '900',
    },
    macroValue: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#2f3542',
    },
});