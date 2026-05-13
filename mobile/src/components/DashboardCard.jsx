import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function DashboardCard({ children }) {
    return (
        <View style={styles.card}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 20,
        margin: 30,
        marginHorizontal: 10,
        width: '90%',
        alignSelf: 'center',
        // The "Paper" Shadow (Works on iOS/Android/Web)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 350, // Fixed height for the "paper"
    }
});
