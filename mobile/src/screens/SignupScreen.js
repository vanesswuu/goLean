import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { signup } from '../services/authService'; //the helper we made


//signup component
const SignupScreen = () => {
    //states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    //onSubmit 
    const handleSignup = async () => {
        try {

            const userData = {
                name, email, password,
                age: Number(age),
                weight: Number(weight),
                height: Number(height),
                gender: 'male', // Keeping it simple for now
                activityLevel: 'moderate'
            };


            const result = await signup(userData); //call our api using the helper
            Alert.alert('success!', `welcome to goLean, ${result.name}`);


        } catch (error) {
            Alert.alert('error', error);
        }
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.title}>goLean</Text>
            <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>

        </ScrollView>

    );

}
const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingHorizontal: 25,
        backgroundColor: '#ffffff',
        paddingBottom: 50,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1e272e',
        textAlign: 'center',
        letterSpacing: -1,
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#f1f2f6',
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
        fontSize: 16,
        color: '#2f3542',
    },
    button: {
        backgroundColor: '#2ed573',
        padding: 22,
        borderRadius: 15,
        marginTop: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default SignupScreen; // This lets App.js see it!
