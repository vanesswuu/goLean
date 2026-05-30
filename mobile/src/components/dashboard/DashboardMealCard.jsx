//meal card in today's log in dashboard screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardMealCard({ meal }) {
    return (

        <View style={styles.mealRecord}>

            <View style={styles.foodInfo}>

                <Text style={styles.recordType}>{meal.type}</Text>
                {(meal.food || '').split(',').map((item, idx) => (
                    <Text key={idx} style={styles.recordFood}>{item.trim()}</Text>
                ))}

                <Text style={styles.recordCals}>+ {meal.calories} kcal</Text>

            </View>

            <View style={styles.macrosSection}>

                <MacroPill label='P' value={meal.p} color='#ff4757' />
                <MacroPill label='C' value={meal.c} color="#2f3542" />
                <MacroPill label='F' value={meal.f} color="#ffa502" />

            </View>

        </View>

    );
}

const MacroPill = ({ label, value, color }) => (
    <View style={styles.macroPill}>
        <Text style={[styles.macroLabel, { color }]}>{label}</Text>
        <Text style={styles.macroValue}>{value}g</Text>
    </View>
);

const styles = StyleSheet.create({
    mealRecord: {
        backgroundColor: '#ffffff',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    foodInfo: {
        flex: 1,
        marginRight: 12,
    },
    recordType: {
        fontSize: 10,
        fontWeight: '700',
        color: '#2ed573',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    recordFood: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1a1a1a',
        lineHeight: 20,
    },
    recordCals: {
        fontSize: 12,
        fontWeight: '500',
        color: '#aaa',
        marginTop: 5,
    },
    macrosSection: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 5,
    },
    macroPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    macroLabel: {
        fontSize: 10,
        fontWeight: '700',
        width: 10,
    },
    macroValue: {
        fontSize: 11,
        fontWeight: '500',
        color: '#555',
        width: 32,
        textAlign: 'right',
    },
});