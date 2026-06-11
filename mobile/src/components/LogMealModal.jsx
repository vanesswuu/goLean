import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { parseMealAPI } from '../services/logService';

const meal_types = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function LogMealModal({ visible, onClose, onSave }) {

    const { user } = useAuth();

    const [mealType, setMealType] = useState('Lunch');
    const [naturalText, setNaturalText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // temporary holder: keeps track of the items in a specific meal
    const [itemsInMeal, setItemsInMeal] = useState([]);

    const handleAnalyze = async () => {
        if (!naturalText.trim()) return Alert.alert('Please enter what you ate.');

        setIsLoading(true);
        try {
            // Send natural language to our new Gemini route
            const parsedItems = await parseMealAPI(naturalText, user.token);

            const newItems = parsedItems.map((item, index) => ({
                id: Date.now() + index,
                name: item.name,
                weight: item.weight,
                kcals: item.kcals,
                p: item.p,
                c: item.c,
                f: item.f
            }));

            setItemsInMeal([...itemsInMeal, ...newItems]);
            setNaturalText('');
        } catch (error) {
            console.error('AI error:', error);
            Alert.alert('Error', 'Could not parse your meal. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = (id) => {
        setItemsInMeal(itemsInMeal.filter(item => item.id !== id));
    };

    // logging the entire meal
    const handleLogFinalMeal = () => {
        if (itemsInMeal.length === 0) {
            Alert.alert('No food added');
            return;
        }

        // create the summary
        const summary = itemsInMeal.map(i => `${i.weight}g ${i.name}`).join(', ');

        // send it home to dashboard
        onSave({
            id: Date.now().toString(),
            type: mealType,
            food: summary,
            calories: itemsInMeal.reduce((sum, i) => sum + i.kcals, 0),
            p: itemsInMeal.reduce((sum, i) => sum + i.p, 0),
            c: itemsInMeal.reduce((sum, i) => sum + i.c, 0),
            f: itemsInMeal.reduce((sum, i) => sum + i.f, 0),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        // reset
        setItemsInMeal([]);
        setNaturalText('');
        onClose();
    }

    const handleClose = () => {
        setItemsInMeal([]);
        setNaturalText('');
        onClose();
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
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

                    {/* AI INPUT BOX */}
                    <View style={styles.calculatorBox}>
                        <TextInput
                            placeholder="e.g., 2 slices of pepperoni pizza and a can of coke..."
                            style={styles.aiInput}
                            multiline
                            numberOfLines={3}
                            value={naturalText}
                            onChangeText={setNaturalText}
                        />
                        <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.analyzeText}>Analyze with AI</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* TEMPORARY LIST */}
                    <ScrollView style={styles.tempList}>
                        {itemsInMeal.length === 0 && !isLoading && (
                            <Text style={styles.emptyText}>Tell the AI what you ate!</Text>
                        )}
                        {itemsInMeal.map(item => (
                            <View key={item.id} style={styles.tempItem}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.weight}g {item.name}</Text>
                                    <Text style={{ color: '#747d8c', fontSize: 12, marginTop: 4 }}>
                                        {item.p}g Protein • {item.c}g Carbs • {item.f}g Fats
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end', flexDirection: 'row', gap: 15 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#2f3542' }}>{item.kcals} kcal</Text>
                                    <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                                        <Ionicons name="trash-outline" size={20} color="#ff4757" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* TOTALS FOOTER */}
                    {itemsInMeal.length > 0 && (
                        <View style={styles.totalsBox}>
                            <Text style={styles.totalsText}>
                                Total: {itemsInMeal.reduce((sum, i) => sum + i.kcals, 0)} kcal
                            </Text>
                        </View>
                    )}

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
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
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, height: '80%' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    typeBtn: { padding: 10, borderRadius: 10, backgroundColor: '#f1f2f6' },
    typeBtnActive: { backgroundColor: '#2ed573' },
    typeText: { fontSize: 12, fontWeight: 'bold', color: '#747d8c' },
    typeTextActive: { color: '#fff' },
    calculatorBox: { padding: 15, backgroundColor: '#f8f9fa', borderRadius: 15 },
    aiInput: { backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#dfe4ea', fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
    analyzeBtn: { backgroundColor: '#2f3542', padding: 15, borderRadius: 12, marginTop: 10, alignItems: 'center' },
    analyzeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    tempList: { marginVertical: 20 },
    emptyText: { textAlign: 'center', color: '#a4b0be', marginTop: 20, fontStyle: 'italic' },
    tempItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f2f6' },
    totalsBox: { padding: 10, alignItems: 'center', marginBottom: 10 },
    totalsText: { fontSize: 18, fontWeight: '900', color: '#2ed573' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f2f6', paddingTop: 20 },
    saveBtn: { backgroundColor: '#2f3542', padding: 15, borderRadius: 15, flex: 2, marginLeft: 20, alignItems: 'center' },
    saveText: { color: '#fff', fontWeight: 'bold' },
    cancelBtn: { padding: 15 },
    cancelText: { color: '#a4b0be', fontWeight: 'bold' }
});
