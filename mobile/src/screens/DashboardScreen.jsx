import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';//import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

//hooks
import { useDashboardData } from '../hooks/useDashboardData';

//component imports
import DashboardHeader from '../components/DashboardHeader';
import DashboardCard from '../components/DashboardCard';
import NutrientCircle from '../components/NutrientCircle';
import MacroCircles from '../components/MacroCircles';
import LogMealModal from '../components/LogMealModal';
import DashboardMealCard from '../components/dashboard/DashboardMealCard';
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState';

//context and logic
import { useAuth } from '../context/AuthContext';
import { calculateNutrition } from '../utils/calculations';

//import daily logs service and get log data
import { saveLogAPI } from '../services/logService';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {

    const { user } = useAuth();

    const [activeIndex, setActiveIndex] = useState(0);

    const {
        meals, totals, plan, isModalVisible, setModalVisible, handleSaveMeal, resetDay
    } = useDashboardData(user);

    //carousel slides
    const handleScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        setActiveIndex(Math.round(index));
    };
    const slides = [
        {
            id: 'cal',
            component:
                <NutrientCircle
                    consumed={totals.consumed}
                    limit={plan.calories}
                />
        },
        {
            id: 'mac',
            component:
                <MacroCircles
                    plan={plan}
                    consumedP={totals.p}
                    consumedC={totals.c}
                    consumedF={totals.f}
                />
        }
    ]

    return (
        <View style={styles.container}>

            <DashboardHeader />

            <ScrollView style={styles.scroll}>

                <View style={styles.content}>

                    {/* FlatList carousel for cals and macros */}
                    <FlatList
                        data={slides}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        onMomentumScrollEnd={handleScroll}
                        renderItem={({ item }) => (
                            <View style={{ width }}>
                                <DashboardCard>{item.component}</DashboardCard>
                            </View>
                        )}
                        style={{ maxHeight: 420 }}
                    />

                    {/* Pagination Dots */}

                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeIndex === index ? styles.activeDot : styles.inactiveDot
                                ]}
                            />
                        ))}
                    </View>

                    {/* log meal btn*/}
                    <TouchableOpacity style={styles.logButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add-circle" size={26} color="#fff" />
                        <Text style={styles.logButtonText}>Log a Meal</Text>

                    </TouchableOpacity>

                    {/* meal history list */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 30, marginTop: 30, marginBottom: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: '900', color: '#2f3542' }}>Today's Log</Text>

                        <TouchableOpacity onPress={() => resetDay()}>
                            <Text style={{ color: '#ff4757', fontWeight: 'bold', fontSize: 15 }}>Day Finished</Text>
                        </TouchableOpacity>
                    </View>

                    {/* the empty state (no foog logged)*/}

                    {meals.length === 0 && <DashboardEmptyState />}

                    {/* the foods logged today*/}

                    {meals.map((meal, index) => (
                        <DashboardMealCard key={meal.id || index} meal={meal} />
                    ))}

                </View>

            </ScrollView>

            {/* the modal */}
            <LogMealModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveMeal}
            />

        </View>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    content: { paddingBottom: 50 },
    welcomeText: { fontSize: 32, fontWeight: 'bold', color: '#2f3542', paddingHorizontal: 25, marginBottom: 10 },
    logButton: { backgroundColor: '#2ed573', flexDirection: 'row', padding: 20, marginHorizontal: 30, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 15, elevation: 5 },
    logButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
    historyTitle: { fontSize: 20, fontWeight: '900', color: '#2f3542', marginHorizontal: 30, marginTop: 30, marginBottom: 15 },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10, // Pulls them closer to the card
        marginBottom: 10
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'green',
        width: 20, // This creates the "pill" shape for the active slide
    },
    inactiveDot: {
        backgroundColor: '#ced4da',
    },


});


