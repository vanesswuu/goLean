import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardEmptyState() {

    return (

        <View style={styles.noLogContainer}>

            <View style={styles.noLogCircle}>
                <Text style={styles.noLogEmoji}>🍽️</Text>
            </View>

            <Text style={styles.noLogTitle}>No meals logged yet</Text>

            <Text style={styles.noLogSubtitle}>
                Your daily nutrition summary will appear
                here once you add your first meal.
            </Text>

        </View>

    );

}

const styles = StyleSheet.create({
    noLogContainer: { backgroundColor: '#fff', borderRadius: 25, padding: 30, marginHorizontal: 20, marginTop: 10, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#e0e0e0' },
    noLogCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#f1f2f6', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    noLogEmoji: { fontSize: 32 },
    noLogTitle: { fontSize: 18, fontWeight: '700', color: '#2f3542', marginBottom: 8 },
    noLogSubtitle: { fontSize: 14, color: '#a4b0be', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
});