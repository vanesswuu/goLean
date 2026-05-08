//for profile screen
// this is where the user can update current weight and progress

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {

    const { user } = useAuth();

    // current user data initialized
    const [age, setAge] = useState(user?.age?.toString() || '');
    const [weight, setWeight] = useState(user?.weight?.toString() || '');
    const [height, setHeight] = useState(user?.height?.toString() || '');
    const [gender, setGender] = useState(user?.gender || 'male');
    const [goal, setGoal] = useState(user?.goal || 'maintenance');

    const handleSave = () => {
        //this is where api call/save will be handled next
        Alert.alert("Phase 2 Complete!", "UI looks good. Ready for Phase 3?");
    }

    return (
        <ScrollView style={styles.container}>

            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#2f3542" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 28 }} />

            </View>

            <View style={styles.content}>

                <Text style={styles.sectionTitle}>Personal Stats</Text>
                <View style={styles.card}>
                    {/* Section 1: Personal Info */}
                    <MetricInput
                        label='Age'
                        value={age}
                        onChangeText={setAge}
                        placeholder='Age'
                        icon="calendar-outline"
                    />
                    <MetricInput
                        label='Weight (kg)'
                        value={weight}
                        onChangeText={setWeight}
                        placeholder='kg'
                        icon="scale-outline"
                    />
                    <MetricInput
                        label="Height (cm)"
                        value={height}
                        onChangeText={setHeight}
                        placeholder="cm"
                        icon="resize-outline"
                    />
                </View>

                {/* Section 2: Gender Selection */}
                <Text style={styles.sectionTitle}>Gender</Text>
                <View style={styles.genderRow}>

                    <TouchableOpacity
                        style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
                        onPress={() => setGender('male')}
                    >
                        <Ionicons name='male' size={20} color={gender === 'male' ? '#fff' : '#2f3542'} />
                        <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
                        onPress={() => setGender('female')}
                    >
                        <Ionicons name='female' size={20} color={gender === 'female' ? '#fff' : '#2f3542'} />
                        <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>

                    </TouchableOpacity>

                </View>


                {/* Section 3: Goal */}
                <Text style={styles.sectionTitle}>Fitness Goal</Text>

                <View style={styles.card}>
                    {['lose weight', 'maintenance', 'gain muscle'].map((g) =>
                    (
                        <TouchableOpacity
                            key={g}
                            style={styles.goalOption}
                            onPress={() => setGoal(g)}
                        >
                            <Text style={[styles.goalText, goal === g && styles.goalTextActive]}>
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </Text>
                            {goal === g && <Ionicons name="checkmark-circle" size={22} color="#2ed573" />}

                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );


}

//helper component for inputs
const MetricInput = ({ label, value, onChangeText, placeholder, icon }) => (
    <View style={styles.inputContainer}>
        <Ionicons name={icon} size={20} color='#a4b0be' style={styles.inputIcon} />
        <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType='numeric'
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#2f3542' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#a4b0be', textTransform: 'uppercase', marginBottom: 10, marginLeft: 5 },
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 25, elevation: 2 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f2f6' },
    inputIcon: { marginRight: 15 },
    inputLabel: { fontSize: 12, color: '#a4b0be', fontWeight: 'bold' },
    input: { fontSize: 16, color: '#2f3542', fontWeight: 'bold', paddingVertical: 5 },
    genderRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
    genderBtn: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2 },
    genderBtnActive: { backgroundColor: '#2f3542' },
    genderText: { fontWeight: 'bold', color: '#2f3542' },
    genderTextActive: { color: '#fff' },
    goalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f2f6' },
    goalText: { fontSize: 16, color: '#57606f', fontWeight: '600' },
    goalTextActive: { color: '#2f3542', fontWeight: 'bold' },
    saveButton: { backgroundColor: '#2ed573', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10, elevation: 5 },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});