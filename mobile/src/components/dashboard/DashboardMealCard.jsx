import { React } from 'react';
import { View, Text, Stylesheet } from 'react-native';

export default function DashboardMealCard({ meal }) {
    return (

        <View style={styles.mealRecord}>

            <View style={styles.foodInfo}>

                <Text style={styles.recordType}>{meal.type}</Text>
                {(meal.food || '').split(',').map((item, idx) => (
                    <Text key={idx} styles={styles.recordFood}>{item.trim()}</Text>
                ))};

                <Text style={styles.recordCals}>+ {meal.calories} kcal</Text>

            </View>

            <View style={styles.macrosSection}>

                <Macropill label='P' value={meal.p} color='#ff4757' />
                <Macropill label='C' value={meal.c} color="#2f3542" />
                <Macropill label='F' value={meal.f} color="#ffa502" />

            </View>

        </View>

    );
}

const MacroPill = ({ label, value, color }) => (
    <View style={styles.macroPill}>
        <Text style={[styles.macroLabel, { color }]}>{label}</Text>
        <Text style={styles.macroValue}>{value}g</Text>
    </View>
);

const styles = StyleSheet.create({
    mealRecord: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', padding: 20, marginHorizontal: 30, borderRadius: 20, marginBottom: 12, elevation: 2 },
    foodInfo: { flex: 1, paddingRight: 10 },
    recordType: { fontSize: 18, fontWeight: '900', textTransform: 'uppercase', color: '#2ed573', marginBottom: 5 },
    recordFood: { fontSize: 13, color: '#2f3542' },
    recordCals: { fontSize: 16, fontWeight: '900', color: '#2f3542', marginTop: 6 },
    macrosSection: { flexDirection: 'column', gap: 5, alignItems: 'flex-end', justifyContent: 'center' },
    macroPill: { backgroundColor: '#f1f2f6', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 65 },
    macroLabel: { fontSize: 10, fontWeight: '900', marginRight: 5 },
    macroValue: { fontSize: 11, fontWeight: 'bold', color: '#2f3542' },
});