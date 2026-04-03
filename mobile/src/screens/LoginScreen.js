import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity, Alert
} from 'react-native';
import { login } from '../services/authService';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {


            if (!email || !password) {
                return Alert.alert('error', 'please fill in all fields');
            }

            const credentials = {
                email, password
            }

            const result = await login(credentials);
            Alert.alert('success!', `welcome back, ${result.name}`);
            navigation.navigate('Main');

        } catch (error) {
            Alert.alert('error', error);
        }
    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>goLean </Text>

            <TextInput
                style={styles.input} placeholder="Email"
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
            />
            <TextInput
                style={styles.input} placeholder="Password"
                value={password} onChangeText={setPassword} secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

        </View>
    );


    //end of login component
};
// --- Styles (You can copy these or tweak them!) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 120,
        paddingHorizontal: 25,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1e272e',
        textAlign: 'center',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: '#808e9b',
        textAlign: 'center',
        marginBottom: 50,
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
        backgroundColor: '#2f3542', // A darker, pro color for Login
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
export default LoginScreen;