import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

//utils
import { formatTime } from '../utils/runCalculations';

//service import
import { getLogsAPI } from '../services/logService';
import { getRuns } from '../services/runLogService';


//context import // to get token to be sent to service
import { useAuth } from '../context/AuthContext'

//component imports
import MealLogCard from '../components/history/MealLogCard';
import RunCard from '../components/history/RunCard';
import HistoryToggle from '../components/history/HistoryToggle';
import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {

    const { user } = useAuth();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('meals');

    const [runs, setRuns] = useState([]);

    const [logs, setLogs] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    const [expandedId, setExpandedId] = useState(null);


    useEffect(() => {
        // Only run the fetch logic if we have a user
        if (user && user.token) {
            const loadHistory = async () => {
                try {
                    if (activeTab === 'meals') {
                        const data = await getLogsAPI(user.token);
                        setLogs(data);
                    } else {
                        const data = await getRuns(user.token);
                        setRuns(data);
                    }
                } catch (error) {
                    console.error('error fetching history');
                } finally {
                    setisLoading(false); // This finally gets called!
                }
            };
            loadHistory();
        } else {
            // If there is no user, we stop loading so we don't get stuck!
            setisLoading(false);
        }
    }, [activeTab, user.token]);


    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#2ed573" />
            </View>
        )
    }

    return (

        <View style={styles.container}>


            <HistoryToggle
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setisLoading(true);
                    setActiveTab(tab);
                }}
            />

            <FlatList
                data={activeTab === 'meals' ? logs : runs}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {

                    const dropdown = () => {
                        setExpandedId(expandedId === item._id ? null : item._id)
                    }

                    if (activeTab === 'meals') {

                        return (
                            <MealLogCard item={item} isExpanded={expandedId === item._id} onPress={dropdown} />
                        )

                    } else {
                        return (
                            <RunCard item={item} />
                        );
                    }


                }}

                ListEmptyComponent={
                    <View style={styles.emptyStateContainer}>
                        <Ionicons
                            name={activeTab === 'meals' ? 'restaurant-outline' : 'fitness-outline'}
                            size={70}
                            color="#ced6e0"
                        />
                        <Text style={styles.emptyStateTitle}>
                            {activeTab === 'meals' ? 'No Meals Logged Yet' : 'No Runs Recorded'}
                        </Text>
                        <Text style={styles.emptyStateSubtitle}>
                            {activeTab === 'meals'
                                ? 'Track your meals daily to see your calorie logs and TDEE progress here!'
                                : 'Record your outdoor walks or runs to keep track of your distance and maps!'}
                        </Text>
                        {activeTab === 'runs' && (
                            <TouchableOpacity
                                style={styles.emptyStateButton}
                                onPress={() => navigation.navigate('RunTracker')}
                            >
                                <Text style={styles.emptyStateButtonText}>Record Your First Run</Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
    toggleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#a4b0be'
    },
    activeToggleText: {
        color: '#fff'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#a4b0be',
        fontSize: 16,
        fontWeight: 'bold'
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2f3542',
        marginTop: 15,
    },
    emptyStateSubtitle: {
        fontSize: 14,
        color: '#747d8c',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    emptyStateButton: {
        backgroundColor: '#2ed573', // Matches goLean's theme green
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    emptyStateButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});