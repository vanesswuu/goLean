import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';//import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';


//component imports
import DashboardHeader from '../components/DashboardHeader';
import DashboardCard from '../components/DashboardCard';
import NutrientCircle from '../components/NutrientCircle';
import MacroCircles from '../components/MacroCircles';
import LogMealModal from '../components/LogMealModal';

//context and logic
import { useAuth } from '../context/AuthContext';
import { calculateNutrition } from '../utils/calculations';

//import daily logs service and get log data
import { saveLogAPI } from '../services/logService';




const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {

    const { user } = useAuth();

    //the master list, starts empty, holds all meals logged today
    const [meals, setMeals] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    //math logic: calculates daily total cals from the 'meals' array
    const dailyConsumedTotal = meals.reduce((sum, meal) =>
        sum + (meal.calories || 0), 0);

    //math logic for calculating daily macros
    const dailyP = meals.reduce((sum, meal) => sum + (meal.p || 0), 0);
    const dailyC = meals.reduce((sum, meal) => sum + (meal.c || 0), 0);
    const dailyF = meals.reduce((sum, meal) => sum + (meal.f || 0), 0);

    const dailyIntakeTotal = {
        dateString: new Date().toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        }),
        totalCals: dailyConsumedTotal,
        protein: dailyP,
        carbs: dailyC,
        fats: dailyF,
        meals: meals
    }


    const plan = calculateNutrition(
        user?.age,
        user?.weight,
        user?.height,
        user?.gender,
        user?.activityLevel,
        user?.goal
    );

    //logging logic - saving a whole meal to the list
    const handleSaveMeal = async (newMeal) => {
        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        await AsyncStorage.setItem(`daily_meals_${user.id}`, JSON.stringify(updatedMeals));
        const dateToday = new Date().toDateString();
        await AsyncStorage.setItem(`last_log_date${user.id}`, dateToday);
        setModalVisible(false);
    };

    const resetDay = async (existingMeals = null) => {

        const mealsToLog = existingMeals || meals;

        if (mealsToLog.length === 0) return;

        const totals = {
            dateString: new Date().toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            }),
            totalCals: mealsToLog.reduce((s, m) => s + (m.calories || 0), 0),
            protein: mealsToLog.reduce((s, m) => s + (m.p || 0), 0),
            carbs: mealsToLog.reduce((s, m) => s + (m.c || 0), 0),
            fats: mealsToLog.reduce((s, m) => s + (m.f || 0), 0),
            meals: mealsToLog
        };


        try {
            await saveLogAPI(totals, user.token) // the api call to post to daily logs
            setMeals([]);
            await AsyncStorage.removeItem(`daily_meals_${user.id}`);
            setModalVisible(false);
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {


        const loadDates = async () => {
            const savedMeals = await AsyncStorage.getItem(`daily_meals_${user.id}`);
            const lastDate = await AsyncStorage.getItem(`last_log_date${user.id}`)

            const today = new Date().toDateString();

            if (savedMeals) {
                const parsed = JSON.parse(savedMeals);

                if (lastDate && lastDate !== today) {
                    await resetDay(parsed);
                } else {
                    setMeals(parsed)
                }
            }
            await AsyncStorage.setItem(`last_log_date${user.id}`, today);

        }


        loadDates().catch(err => console.log("Init error:", err));
    }, []); // This runs "Once" when the app starts


    //carousel slides
    const slides = [
        {
            id: 'cal',
            component:
                <NutrientCircle
                    consumed={dailyConsumedTotal}
                    limit={plan.calories}
                />
        },
        {
            id: 'mac',
            component:
                <MacroCircles
                    plan={plan}
                    consumedP={dailyP}
                    consumedC={dailyC}
                    consumedF={dailyF}
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
                        renderItem={({ item }) => (
                            <View style={{ width }}>
                                <DashboardCard>{item.component}</DashboardCard>
                            </View>
                        )}
                        style={{ maxHeight: 420 }}
                    />

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

                    {meals.length === 0 && (
                        <View style={styles.noLogContainer}>
                            <View style={styles.noLogCircle}>
                                <Text style={styles.noLogEmoji}>🍽️</Text>
                            </View>
                            <Text style={styles.noLogTitle}>No meals logged yet</Text>
                            <Text style={styles.noLogSubtitle}>Your daily nutrition summary will appear here once you add your first meal.</Text>
                        </View>
                    )}

                    {/* the foods logged today*/}

                    {meals.map((meal, index) => (
                        <View key={meal.id || index} style={styles.mealRecord}>

                            {/* Left Side: Type, Foods, and Calories */}
                            <View style={{ flex: 1, paddingRight: 10 }}>
                                <Text style={styles.recordType}>{meal.type}</Text>

                                {(meal.food || '').split(',').map((item, idx) => (
                                    <Text key={idx} style={styles.recordFood}>
                                        {item.trim()}
                                    </Text>
                                ))}

                                <Text style={[styles.recordCals, { marginTop: 6, fontSize: 16 }]}>
                                    + {meal.calories} kcal
                                </Text>
                            </View>
                            {/* Right Side: Macro Breakdown Stack */}
                            <View style={styles.macrosSection}>
                                <View style={styles.macroPill}>
                                    <Text style={[styles.macroLabel, { color: '#ff4757' }]}>P</Text>
                                    <Text style={styles.macroValue}>{meal.p}g</Text>
                                </View>
                                <View style={styles.macroPill}>
                                    <Text style={[styles.macroLabel, { color: '#2f3542' }]}>C</Text>
                                    <Text style={styles.macroValue}>{meal.c}g</Text>
                                </View>
                                <View style={styles.macroPill}>
                                    <Text style={[styles.macroLabel, { color: '#ffa502' }]}>F</Text>
                                    <Text style={styles.macroValue}>{meal.f}g</Text>
                                </View>
                            </View>

                        </View>
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
    mealRecord: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', padding: 20, marginHorizontal: 30, borderRadius: 20, marginBottom: 12, elevation: 2 },
    recordType: { fontSize: 18, fontWeight: '900', textTransform: 'uppercase' },
    recordFood: { fontSize: 13, color: '#2f3542', width: 170 },
    recordCals: { fontSize: 20, fontWeight: '900', color: '#2f3542' },
    macrosSection: {
        flexDirection: 'column',
        gap: 5,
        alignItems: 'flex-end',
        justifyContent: 'center', // Centers the pills vertically in the card
    },
    macroPill: {
        backgroundColor: '#f1f2f6',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 65,
    },
    macroLabel: {
        fontSize: 10,
        fontWeight: '900',
        marginRight: 5,
    },
    macroValue: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#2f3542',
    },
    noLogContainer: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 30,
        marginHorizontal: 20,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#e0e0e0', // Subtle dashed border looks "ready for data"
    },
    noLogCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    noLogEmoji: {
        fontSize: 32,
    },
    noLogTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2f3542',
        marginBottom: 8,
    },
    noLogSubtitle: {
        fontSize: 14,
        color: '#a4b0be',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
});


