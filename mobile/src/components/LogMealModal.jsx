import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FOOD_DB } from '../constants/foodDb';

const meal_types = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function LogMealModal({ visible, onClose, onSave }) {

    const [mealType, setMealType] = useState('lunch');
    const [currentFood, setCurrentFood] = useState('rice');
    const [grams, setGrams] = useState('');

    //temporary holder: keeps track of the items in a specific meal
    const [itemsInMeal, setItemsInMeal] = useState([]);

    const handleAddFood = () => {
        if (!grams || isNaN(grams)) return Alert.alert('wait. please enter the grams');

        const food = FOOD_DB[currentFood] || 1.0;
        const g = parseFloat(grams);

        const newItem = {
            id: Date.now(),
            name: currentFood,
            weight: grams,
            kcals: Math.round(g * food.kcal),
            p: Math.round(g * food.p),
            c: Math.round(g * food.c),
            f: Math.round(g * food.f)
        }


        setItemsInMeal([...itemsInMeal, newItem]);
        setGrams('');
    };


    const handleLogFinalMeal = () => {

        if (itemsInMeal.length === 0) {

            Alert.alert('no food added');
            return;

        }

        //create the summary
        const summary = itemsInMeal.map(i => `${i.weight}g ${i.name}`).join(',');

        //send it home to dashboard //the payload to be added to meal state in dashboard
        onSave({
            id: Date.now().toString(),
            type: mealType,
            food: summary,
            calories: itemsInMeal.reduce((sum, i) => sum + i.kcals, 0),
            p: itemsInMeal.reduce((sum, i) => sum + i.p, 0),
            c: itemsInMeal.reduce((sum, i) => sum + i.c, 0),
            f: itemsInMeal.reduce((sum, i) => sum + i.f, 0),
            timestamp: new Date().toLocaleTimeString([],
                { hour: '2-digit', minute: '2-digit' })
        });

        //reset
        setItemsInMeal([]);
        onClose();

    }

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
                    <Text style={styles.title}>What's for {mealType}?</Text>

                    {/* SELECTOR */}
                    <View style={styles.typeRow}>
                        {meal_types.map(t => (
                            <TouchableOpacity key={t} style={[styles.typeBtn, mealType === t && styles.typeBtnActive]} onPress={() => setMealType(t)}>
                                <Text style={[styles.typeText, mealType === t && styles.typeTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    {/* CALCULATOR */}
                    <View style={styles.calculatorBox}>
                        <View style={styles.inputRow}>
                            {/* WE ADD THIS NEW WRAPPER */}
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Food"
                                    style={[styles.input, { flex: 2 }]}
                                    value={currentFood}
                                    onChangeText={setCurrentFood}
                                />
                                <TextInput
                                    placeholder="Grams"
                                    style={[styles.input, { flex: 1, marginLeft: 8 }]}
                                    keyboardType="numeric"
                                    value={grams}
                                    onChangeText={setGrams}
                                />
                            </View>
                            {/* THE BUTTON NOW HAS ITS OWN SPACE */}
                            <TouchableOpacity style={styles.addBtn} onPress={handleAddFood}>
                                <Ionicons name="add" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* TEMPORARY LIST */}
                    <ScrollView style={styles.tempList}>
                        {itemsInMeal.map(item => (
                            <View key={item.id} style={styles.tempItem}>
                                <Text>{item.weight}g {item.name}</Text>
                                <Text style={{ fontWeight: 'bold' }}>{item.kcals} kcal</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleLogFinalMeal}>
                            <Text style={styles.saveText}>Log Entire Meal</Text>
                        </TouchableOpacity>
                    </View>

                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );


}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, height: '75%' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    typeBtn: { padding: 10, borderRadius: 10, backgroundColor: '#f1f2f6' },
    typeBtnActive: { backgroundColor: '#2ed573' },
    typeText: { fontSize: 12, fontWeight: 'bold', color: '#747d8c' },
    typeTextActive: { color: '#fff' },
    calculatorBox: { padding: 15, backgroundColor: '#f8f9fa', borderRadius: 15 },
    inputRow: { flexDirection: 'row', alignItems: 'center' },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#dfe4ea' },
    addBtn: { backgroundColor: '#2ed573', width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
    tempList: { marginVertical: 20 },
    tempItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f2f6' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f2f6', paddingTop: 20 },
    saveBtn: { backgroundColor: '#2f3542', padding: 15, borderRadius: 15, flex: 2, marginLeft: 20, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: 'bold' },
    cancelBtn: { padding: 15 },
    cancelText: { color: '#a4b0be', fontWeight: 'bold' },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    inputWrapper: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 10
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,       // Shrunk padding slightly to save space
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dfe4ea',
        fontSize: 14       // Slightly smaller text to fit more
    },
});