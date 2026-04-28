//this is for the recorded runs

import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatTime } from '../../utils/runCalculations';

export default function RunCard({ item }) {

    return (

        <View style={styles.runCard}>

            <View style={styles.runHeader}>

                <View style={styles.runDateBadge}>
                    <Ionicons name='calendar-outline' size={14} color='#2ed573' />
                    <Text style={styles.runDateText}>{item.date}</Text>
                </View>

                <View style={styles.runSpeedBadge}>
                    <Text style={styles.runSpeedText}>{item.speed}km/h</Text>
                </View>

            </View>


            <View style={styles.runStatsRow}>

                <View style={styles.runStat}>

                    <Text style={styles.runStatLabel}>Distance</Text>
                    <Text style={styles.runStatValue}>{item.distance?.toFixed(2) || '0.00'}
                        <Text style={styles.runStatUnit}>KM</Text>
                    </Text>

                </View>

                <View style={styles.runStatBorder} />
                <View style={styles.runStat}>
                    <Text style={styles.runStatLabel}>Time</Text>
                    <Text style={styles.runStatValue}>{formatTime(item.timeElapsed)}</Text>
                </View>

            </View>


        </View>

    );

}

const styles = StyleSheet.create({
    runCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f1f2f6'
    },
    runHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    runDateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f2f6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        gap: 6
    },
    runDateText: { fontSize: 12, fontWeight: '800', color: '#2f3542' },
    runSpeedText: { fontSize: 12, fontWeight: '700', color: '#a4b0be' },
    runStatsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    runStat: { alignItems: 'center', flex: 1 },
    runStatValue: { fontSize: 22, fontWeight: '900', color: '#2f3542' },
    runStatLabel: { fontSize: 10, color: '#a4b0be', fontWeight: 'bold' },
    runStatUnit: { fontSize: 12, color: '#a4b0be' },
    runStatBorder: { width: 1, height: '60%', backgroundColor: '#f1f2f6' }
});