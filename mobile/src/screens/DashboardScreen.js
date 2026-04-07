import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
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
        await AsyncStorage.setItem('daily_meals', JSON.stringify(updatedMeals));
        setModalVisible(false);
    };

    const resetDay = async () => {
        setMeals([]);
        await AsyncStorage.removeItem('daily_meals');
        setModalVisible(false);
    };

    useEffect(() => {
        const loadMeals = async () => {
            const saved = await AsyncStorage.getItem('daily_meals');
            if (saved) setMeals(JSON.parse(saved));
        };
        loadMeals();
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
            id: 'mac', component:
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

                    {/* the carousel for the cals and macros*/}
                    <Carousel
                        loop={false}
                        width={width}
                        height={420}
                        data={slides}
                        renderItem={({ item }) =>
                            <DashboardCard>{item.component}</DashboardCard>}
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

                        <TouchableOpacity onPress={resetDay}>
                            <Text style={{ color: '#ff4757', fontWeight: 'bold', fontSize: 15 }}>Day Finished</Text>
                        </TouchableOpacity>
                    </View>

                    {/* the foods logged today*/}
                    {meals.map((meal) => (
                        <View key={meal.id} style={styles.mealRecord}>
                            <View>
                                <Text style={styles.recordType}>{meal.type}</Text>
                                <Text style={styles.recordFood} numberOfLines={1}>{meal.food}</Text>
                            </View>
                            <Text style={styles.recordCals}>+{meal.calories} kcal</Text>
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
    recordType: { fontSize: 12, fontWeight: '900', color: '#2ed573', textTransform: 'uppercase' },
    recordFood: { fontSize: 16, fontWeight: 'bold', color: '#2f3542', width: 170 },
    recordCals: { fontSize: 20, fontWeight: '900', color: '#2f3542' }
});


