import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

//service import
import { getLogsAPI } from '../services/logService';

//context import // to get token to be sent to service
import { useAuth } from '../context/AuthContext'

export default function HistoryScreen() {

    const { user } = useAuth();

    const [logs, setLogs] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const [expandedId, setExpandedId] = useState(null);


    useEffect(() => {
        const loadLogs = async () => {

            try {
                const logs = await getLogsAPI(user.token);
                setLogs(logs);
            } catch (error) {
                console.log(error);
            } finally {
                setisLoading(false);
            }

        }
        loadLogs();
    }, [])

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#2ed573" />
            </View>
        )
    }

    return (

        <View style={styles.container}>
            <Text style={styles.headerTitle}>Daily Total History</Text>

            <FlatList
                data={logs}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {

                    return (

                        <TouchableOpacity style={styles.logCard} key={item._id} onPress={() => setExpandedId(item._id)}>

                            <View>
                                <Text>{item.dateString}</Text>
                                <Text style={styles.mealCount}>{item.meals.length} Meals</Text>

                            </View>
                            <Text>{item.totalCals} Cals</Text>

                        </TouchableOpacity>

                    )
                }}

                ListEmptyComponent={
                    <Text style={styles.emptyText}>No history yet. Finish a day to see it here!</Text>
                }
            />


        </View >

    );


    //end of history screen component
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa', // Clean, slightly off-white background
        padding: 25
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#2f3542',
        marginBottom: 20
    },
    logCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row', // Puts the date on the left, calories on the right
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 3, // Gives it that modern "floating" shadow on Android
        shadowColor: '#000', // For iOS shadow
        shadowOpacity: 0.1,  // For iOS shadow
        shadowRadius: 5      // For iOS shadow
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2f3542'
    },
    mealCount: {
        fontSize: 12,
        color: '#a4b0be',
        marginTop: 4,
        fontWeight: 'bold'
    },
    calText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#2ed573' // Our signature goLean green
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#a4b0be',
        fontSize: 16,
        fontWeight: 'bold'
    }
});