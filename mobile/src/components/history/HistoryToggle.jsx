//this is for toggling in history. for run history and meal logged histor

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function HistoryToggle({ activeTab, onTabChange }) {

    return (

        <View style={styles.toggleContainer}>




            <TouchableOpacity
                style={[styles.toggleBtn, activeTab === 'meals'
                    && styles.activeToggle]}
                onPress={() => {
                    if (activeTab !== 'meals') onTabChange('meals');
                }}
            >

                <Ionicons name='restaurant' size={30} color={activeTab === 'meals' ? '#fff' : '#a4b0be'} />
                <Text style={[styles.toggleText, activeTab === 'meals' && styles.activeToggleText]}>Meals</Text>

            </TouchableOpacity>




            <TouchableOpacity
                style={[styles.toggleBtn, activeTab === 'runs' && styles.activeToggle]}
                onPress={() => {
                    if (activeTab !== 'runs') onTabChange('runs');
                }}
            >
                <Ionicons name='walk' size={30} color={activeTab === 'runs' ? '#fff' : '#a4b0be'} />
                <Text style={[styles.toggleText, activeTab === 'runs' && styles.activeToggleText]}>Runs</Text>
            </TouchableOpacity>




        </View>
    );

}

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#e1e2e6',
        borderRadius: 15,
        padding: 5,
        marginBottom: 25
    },
    toggleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8
    },
    activeToggle: {
        backgroundColor: '#2f3542',
        elevation: 5,
    },
    toggleText: { fontWeight: 'bold', color: '#a4b0be' },
    activeToggleText: { color: '#fff' }
});
