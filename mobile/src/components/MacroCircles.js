import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SmallCircle = ({ label, value, limit, color }) => {

    const radius = 35;
    const circumference = 2 * Math.PI * radius;

    // Calculate the "Fill" exactly like the big circle
    const progress = Math.min(value / limit, 1);
    // Cap at 100%
    const strokeDashoffset = circumference - (progress * circumference);

    const remaining = Math.max(0, limit - value);

    return (

        <View style={styles.item}>
            <Svg height="100" width="100" viewBox="0 0 100 100">

                <Circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#f1f2f6"
                    strokeWidth="8"
                    fill="none"
                />

                <Circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                />

            </Svg>

            <View style={styles.textOverlay}>
                <Text style={styles.val}>{Math.round(remaining)}g</Text>
                <Text style={styles.lab}>{label}</Text>
            </View>

        </View>
    );
};


export default function MacroCircles({ plan, consumedP, consumedC, consumedF }) {
    return (

        <View style={styles.container}>

            <SmallCircle
                label="Prot"
                value={consumedP}
                limit={plan.protein}
                color="#ff4757"
            />

            <SmallCircle
                label="Carb"
                value={consumedC}
                limit={plan.carbs}
                color="#2f3542"
            />

            <SmallCircle
                label="Fat"
                value={consumedF}
                limit={plan.fats}
                color="#ffa502"
            />

        </View>

    );

};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    item: { alignItems: 'center', justifyContent: 'center' },
    textOverlay: { position: 'absolute', alignItems: 'center' },
    val: { fontSize: 14, fontWeight: 'bold', color: '#2f3542' },
    lab: { fontSize: 10, color: '#a4b0be', textTransform: 'uppercase' }
});