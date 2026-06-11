import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateNutrition } from '../utils/calculations';
import { saveLogAPI } from '../services/logService';
import * as Notifications from 'expo-notifications';

export const useDashboardData = (user) => {
    const [meals, setMeals] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    //1. Math Logic (optimized with useMemo)

    const totals = useMemo(() => {
        const consumed = meals.reduce((sum, m) => sum + (m.calories || 0), 0);
        const p = meals.reduce((sum, m) => sum + (m.p || 0), 0);
        const c = meals.reduce((sum, m) => sum + (m.c || 0), 0);
        const f = meals.reduce((sum, m) => sum + (m.f || 0), 0);

        return { consumed, p, c, f };

    }, [meals]);

    //2. Plan Calculation
    const plan = calculateNutrition(
        user?.age,
        user?.weight,
        user?.height,
        user?.gender,
        user?.activityLevel,
        user?.goal
    );

    //3.Functions

    //logging meal
    const handleSaveMeal = async (newMeal) => {

        const updatedMeals = [...meals, newMeal];
        setMeals(updatedMeals);
        await AsyncStorage.setItem(`daily_meals_${user.id}`,
            JSON.stringify(updatedMeals));

        await AsyncStorage.setItem(`last_log_date${user.id}`,
            new Date().toDateString());
        setModalVisible(false);

    }

    //clicking day finished
    const resetDay = async (existingMeals = null) => {

        const mealsToLog = existingMeals || meals;

        if (mealsToLog.length === 0) return;
        const summary = {
            dateString: new Date().toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            }),
            totalCals: totals.consumed,
            protein: totals.p,
            carbs: totals.c,
            fats: totals.f,
            meals: mealsToLog
        };

        try {
            const data = await saveLogAPI(summary, user.token);

            if (data.newMilestone) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: data.newMilestone.title,
                        body: data.newMilestone.body
                    },
                    trigger: null,
                })
            }


            setMeals([]);
            await AsyncStorage.removeItem(`daily_meals_${user.id}`);
            setModalVisible(false);
        } catch (error) {
            console.error('reset error: ', error);
        }

    };

    //. Lifecycle (loading data)
    useEffect(() => {
        const init = async () => {

            if (!user?.id) return;

            const savedMeals = await AsyncStorage.getItem(`daily_meals_${user.id}`);
            const lastDate = await AsyncStorage.getItem(`last_log_date${user.id}`);
            const today = new Date().toDateString();

            if (savedMeals) {

                const parsed = JSON.parse(savedMeals);
                if (lastDate && lastDate !== today) {
                    await resetDay(parsed);
                } else {
                    setMeals(parsed);
                }

            }

        };
        init();
    }, [user?.id]);

    //this is what the component will 'see'
    return {
        meals,
        totals,
        plan,
        isModalVisible,
        setModalVisible,
        handleSaveMeal,
        resetDay
    };
};