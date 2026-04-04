import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import DashboardHeader from '../components/DashboardHeader';

import Carousel from 'react-native-reanimated-carousel';

import DashboardCard from '../components/DashboardCard';
import NutrientCircle from '../components/NutrientCircle';
import MacroCircles from '../components/MacroCircles';

import { useAuth } from '../context/AuthContext';

import { calculateNutrition } from '../utils/calculations';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {

    const { user } = useAuth();

    const plan = calculateNutrition(
        user?.age,
        user?.weight,
        user?.height,
        user?.gender,
        user?.activityLevel,
        user?.goal
    );

    const consumed = 1400;

    const slides = [
        { id: 'cal', component: <NutrientCircle consumed={consumed} limit={plan.calories} /> },
        { id: 'mac', component: <MacroCircles plan={plan} /> }
    ]



    return (
        <View style={styles.container}>
            <DashboardHeader />

            <View style={styles.content}>

                {/* THE NEW CAROUSEL */}
                <Carousel
                    loop={false}
                    width={width}
                    height={400}
                    autoPlay={false}
                    data={slides}
                    scrollAnimationDuration={1000}
                    renderItem={({ item }) => (
                        <DashboardCard>
                            {item.component}
                        </DashboardCard>
                    )}
                />

                {/* Optional: You can put a "Log Meal" button here later! */}
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 25 },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    macroList: {
        flex: 1,
        paddingLeft: 20,
    },
    macroItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    macroLabel: {
        fontSize: 14,
        color: '#a4b0be',
        fontWeight: 'bold',
    },
    macroValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#2f3542',
    },
});


