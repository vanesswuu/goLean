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

export default function HistoryScreen() {

    const { user } = useAuth();
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

            <View style={styles.toggleContainer}>

                <TouchableOpacity
                    style={[styles.toggleBtn, activeTab === 'meals' && styles.activeToggle]}
                    onPress={() => {
                        setisLoading(true); setActiveTab('meals');
                    }}
                >
                    <Ionicons name="restaurant" size={20} color={activeTab === 'meals' ? '#fff' : '#a4b0be'} />
                    <Text style={[styles.toggleText, activeTab === 'meals' && styles.activeToggleText]}>Meals</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleBtn, activeTab === 'runs' && styles.activeToggle]}
                    onPress={() => {
                        setisLoading(true); setActiveTab('runs');
                    }}
                >

                    <Ionicons name="walk" size={20} color={activeTab === 'runs' ? '#fff' : '#a4b0be'} />
                    <Text style={[styles.toggleText, activeTab === 'runs' && styles.activeToggleText]}>Runs</Text>
                </TouchableOpacity>

            </View>

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
                            <>
                                <TouchableOpacity style={styles.logCard} key={item._id} onPress={dropdown}  >

                                    <View>
                                        <Text>{item.dateString}</Text>
                                        <Text style={styles.mealCount}>{item.meals.length} Meals</Text>

                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text>{item.totalCals} Cals</Text>
                                        <Ionicons
                                            name={expandedId === item._id ? 'chevron-up-outline' : 'chevron-down-outline'}
                                            size={24}
                                            color="grey"
                                        />
                                    </View>

                                </TouchableOpacity>

                                {expandedId === item._id && (
                                    <View style={styles.dropdownContainer}>

                                        {item.meals.map((meal, index) => (
                                            <View key={meal.id || index} style={styles.mealCard}>

                                                {/*  left Food Info */}
                                                <View style={{ flex: 1 }}>

                                                    <Text style={styles.mealType}>{meal.type}</Text>

                                                    {(meal.food || '').split(',').map((foodItem, idx) => (
                                                        <Text key={idx} style={styles.mealFood}>
                                                            {foodItem.trim()}
                                                        </Text>
                                                    ))}

                                                    <Text style={styles.mealCals}>{meal.calories} kcal</Text>

                                                </View>

                                                {/*  right Macro Breakdown */}
                                                <View style={styles.macrosSection}>
                                                    <View style={styles.macroPill}>
                                                        {/* Protein Label (Red-ish) */}
                                                        <Text style={[styles.macroLabel, { color: '#ff4757' }]}>P</Text>
                                                        <Text style={styles.macroValue}>{meal.p}g</Text>
                                                    </View>
                                                    <View style={styles.macroPill}>
                                                        {/* Carbs Label (Dark Navy) */}
                                                        <Text style={[styles.macroLabel, { color: '#2f3542' }]}>C</Text>
                                                        <Text style={styles.macroValue}>{meal.c}g</Text>
                                                    </View>
                                                    <View style={styles.macroPill}>
                                                        {/* Fats Label (Orange) */}
                                                        <Text style={[styles.macroLabel, { color: '#ffa502' }]}>F</Text>
                                                        <Text style={styles.macroValue}>{meal.f}g</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}

                                    </View>
                                )}

                            </>
                        )
                    } else {
                        return (
                            <View style={styles.runCard}>

                                <View style={styles.runHeader}>

                                    <View style={styles.runDateBadge}>
                                        <Ionicons name="calendar-outline" size={14} color="#2ed573" />
                                        <Text style={styles.runDateText}>{item.date}</Text>
                                    </View>

                                    <View style={styles.runSpeedBadge}>
                                        <Text style={styles.runSpeedText}>{item.speed} km/h</Text>
                                    </View>

                                </View>

                                <View style={styles.runStatsRow}>

                                    <View style={styles.runStat}>
                                        <Text style={styles.runStatLabel}>Distance</Text>
                                        <Text style={styles.runStatValue}>
                                            {item.distance.toFixed(2)}
                                            <Text style={styles.runStatUnit}> KM</Text>
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
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        marginTop: -12,
        marginBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 10,
        elevation: 2,
    },
    // Each individual meal row
    mealCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 15,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // Subtle border to separate from the dropdown background
        borderWidth: 1,
        borderColor: '#f1f2f6',
    },
    mealType: {
        color: 'green',
        fontSize: 15,
        fontWeight: 'bold',
    },
    mealCals: {
        color: 'green',
        fontSize: 13,
        fontWeight: 'bold',
    },
    macrosSection: {
        flexDirection: 'column', // Change from 'row' to 'column'
        gap: 4,
        alignItems: 'flex-end',
        paddingLeft: 10, // Give some breathing room to the text on the left
    },
    macroPill: {
        backgroundColor: '#f1f2f6',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row', // Put the label and value side-by-side
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 65, // Fixed width keeps them perfectly aligned
    },
    macroLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: '#a4b0be',
        marginRight: 5,
    },
    macroValue: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#2f3542',
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
    activeToggleText: { color: '#fff' },
    /* --- Run Card Styles --- */
    runCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 18,
        elevation: 5,


    },
    runStatsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    runStat: { alignItems: 'center', flex: 1 },
    runStatValue: { fontSize: 22, fontWeight: '900', color: '#2f3542' },
    runStatLabel: { fontSize: 10, color: '#a4b0be', fontWeight: 'bold' },
    runDateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        gap: 6
    },
    runDateText: {
        fontSize: 12,
        color: '#2f3542' // Dark slate for better contrast
    },
    runHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },

});