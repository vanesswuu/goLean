import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { signup } from '../services/authService';
import { useOnboarding } from '../context/OnboardingContext';

const SignupScreen = ({ navigation }) => {
    // 1. Bring in the shopping cart and the clear function
    const { onboarding, clearData } = useOnboarding();

    // Notice we removed setName hook because Name is already in the cart!
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            // 2. We build the MASSIVE payload by combining local state + context state
            const userData = {
                name: onboarding.name,
                email,
                password,
                goal: onboarding.goal,
                barrier: onboarding.barrier,
                age: Number(onboarding.age),
                weight: Number(onboarding.weight),
                height: Number(onboarding.height),
                activityLevel: onboarding.activityLevel,
                gender: onboarding.gender, // Now accurately pulls male/female!
            };

            const result = await signup(userData);
            Alert.alert('Success!', `Welcome to goLean, ${result.name}`);

            // 3. Clear the shopping cart since they've successfully signed up!
            clearData();

            // navigation.navigate('Dashboard'); // Uncomment this later when you build the Dashboard

        } catch (error) {
            Alert.alert('Signup Error', error.toString());
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>goLean</Text>

            {/* Removed the Name input since we already asked them for it! */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25, backgroundColor: '#ffffff', paddingBottom: 50 },
    title: { fontSize: 48, fontWeight: '900', color: '#1e272e', textAlign: 'center', letterSpacing: -1, marginBottom: 40 },
    input: { backgroundColor: '#f1f2f6', padding: 18, borderRadius: 12, marginBottom: 15, fontSize: 16, color: '#2f3542' },
    button: { backgroundColor: '#2ed573', padding: 22, borderRadius: 15, marginTop: 25, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});

export default SignupScreen;
