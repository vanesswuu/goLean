import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getAIQuoteAPI } from '../../services/logService';

export default function DailyMotivation() {
    const { user } = useAuth();
    const [dailyQuote, setDailyQuote] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const quote = await getAIQuoteAPI(user.token);
                setDailyQuote(quote);
            } catch (error) {
                console.error("Failed to fetch AI quote:", error);
                setDailyQuote("The only bad workout is the one that didn't happen.");
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.token) {
            fetchQuote();
        }
    }, [user?.token]);

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="flame" size={24} color="#ff4757" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Daily Reminders</Text>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ff4757" style={{ alignSelf: 'flex-start', marginTop: 5 }} />
                ) : (
                    <Text style={styles.quote}>"{dailyQuote}"</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 30,
        marginBottom: 20,
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    iconContainer: {
        backgroundColor: '#ffeaa7',
        padding: 10,
        borderRadius: 12,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2f3542',
        marginBottom: 4,
    },
    quote: {
        fontSize: 13,
        color: '#747d8c',
        fontStyle: 'italic',
        lineHeight: 18,
    }
});
