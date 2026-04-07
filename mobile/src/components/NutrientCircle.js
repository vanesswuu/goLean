import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function NutrientCircle({ consumed, limit }) {

    // the math for the circle
    const radius = 90;  // how big the circle is
    const circumference = 2 * Math.PI * radius;
    // total length of the circle's edge

    const progress = Math.min(1, consumed / limit);
    // 1600 / 2000 = 0.8
    // 0.8 means the circle is 80% full (you've eaten 80% of your goal)
    // o - 1

    const strokeDashoffset = circumference * (1 - progress);
    // length of circle to HIDE
    // 502.65 * (1 - 0.8) = 100.53
    // Example: hide 20% of the circle → only 80% of green shows

    const remaining = Math.max(0, limit - consumed);
    const surplus = Math.max(0, consumed - limit)

    console.log(surplus);

    return (
        <View style={styles.container}>

            <Svg height="220" width="220" viewBox="0 0 200 200">

                {/* Background Circle (Gray) */}
                <Circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#f1f2f6"
                    strokeWidth="15"
                    fill="none"
                />

                {/* Progress Circle (Green) */}
                <Circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#2ed573"
                    strokeWidth="15"
                    fill="none"
                    //The green circle is always there — just hidden behind a curtain.                   
                    strokeDasharray={circumference} //creates a curtain (one piece of fabric the size of the circle)
                    strokeDashoffset={strokeDashoffset} //how much of the green is covered up
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                />

            </Svg>

            {/* Centered Text */}
            <View style={styles.textContainer}>
                <Text style={styles.caloriesText}>{remaining}</Text>
                <Text style={styles.label}>Calories Left</Text>
            </View>
            {surplus > 0 && (
                <View style={styles.surplusBox}>
                    <Text style={styles.surplusText}>
                        You are {surplus} kcal over maintenance
                    </Text>
                </View>
            )}        </View>


    );


}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
    textContainer: { position: 'absolute', alignItems: 'center' },
    caloriesText: { fontSize: 42, fontWeight: '900', color: '#2f3542' },
    label: { fontSize: 16, color: '#a4b0be', fontWeight: '500' },

});