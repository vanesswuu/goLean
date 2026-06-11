//meal card in today's log in dashboard screen

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardMealCard({ meal }) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{meal.type}</Text>
                </View>
                <Text style={styles.timeText}>{meal.timestamp || 'Just now'}</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.foodList}>
                    {(meal.food || '').split(',').map((item, idx) => (
                        <Text key={idx} style={styles.foodItem}>• {item.trim()}</Text>
                    ))}
                </View>
                <View style={styles.caloriesBox}>
                    <Text style={styles.caloriesValue}>{Math.round(Number(meal.calories || 0))}</Text>
                    <Text style={styles.caloriesLabel}>kcal</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
                <MacroItem label="Protein" value={meal.p} icon="barbell-outline" color="#4dabf7" />
                <MacroItem label="Carbs" value={meal.c} icon="leaf-outline" color="#51cf66" />
                <MacroItem label="Fats" value={meal.f} icon="water-outline" color="#fcc419" />
            </View>
        </View>
    );
}

const MacroItem = ({ label, value, icon, color }) => {
    // Ensures values like 0.2000000 become rounded, clean numbers
    const displayValue = Math.round(Number(value || 0));

    return (
        <View style={styles.macroItem}>
            <View style={[styles.iconWrapper, { backgroundColor: color + '25' }]}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            <Text style={styles.macroValue}>{displayValue}g</Text>
            <Text style={styles.macroLabel}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginHorizontal: 24,
        marginBottom: 16,
        padding: 20,
        shadowColor: '#8a95a5',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    typeBadge: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f1f3f5',
    },
    typeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#495057',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#adb5bd',
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    foodList: {
        flex: 1,
        marginRight: 16,
    },
    foodItem: {
        fontSize: 15,
        fontWeight: '600',
        color: '#212529',
        lineHeight: 22,
        marginBottom: 4,
    },
    caloriesBox: {
        alignItems: 'flex-end',
    },
    caloriesValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#212529',
        letterSpacing: -0.5,
    },
    caloriesLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#868e96',
        marginTop: -2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f3f5',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    macroItem: {
        alignItems: 'center',
    },
    iconWrapper: {
        padding: 8,
        borderRadius: 12,
        marginBottom: 8,
    },
    macroValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#343a40',
        marginBottom: 2,
    },
    macroLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#adb5bd',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});