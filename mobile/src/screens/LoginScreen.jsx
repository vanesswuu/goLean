import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TextInput,
    TouchableOpacity, Alert
} from 'react-native';

//auth service
import { login as loginAPI } from '../services/authService';

//auth context to login and save user data to async storage
import { useAuth } from '../context/AuthContext';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { googleLogin as googleLoginAPI } from '../services/authService';



const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const emailRef = useRef(null);
    const [password, setPassword] = useState('');

    const { login } = useAuth(); //the context

    useEffect(() => {

        emailRef.current?.focus();

    }, [])

    // const handleGoogleLogin = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const response = await GoogleSignin.signIn();
    //         const idToken = response.idToken || response.data?.idToken
    //
    //         if (idToken) {
    //             const result = await googleLoginAPI(idToken);
    //             Alert.alert('Success!', `Hi, ${result.name}!`)
    //             await login(result);
    //         }
    //     } catch (error) {
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //             // User cancelled
    //         } else {
    //             Alert.alert('Google Auth Error', error.toString());
    //         }
    //     }
    // }

    const handleLogin = async () => {
        try {


            if (!email || !password) {
                return Alert.alert('error', 'please fill in all fields');
            }

            const credentials = {
                email, password
            }

            //we can do an api call without storing it
            //but we need the result to be passed to the login/authContext
            const result = await loginAPI(credentials); //the api call //returns the user data
            Alert.alert('success!', `welcome back, ${result.name}`);

            await login(result); //the context

        } catch (error) {
            Alert.alert('error', error);
        }
    };

    return (

        <View style={styles.container}>

            <Text style={styles.title}>goLean </Text>

            <TextInput ref={emailRef}
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
            {/* <TouchableOpacity
                style={[styles.button, { backgroundColor: '#db4437', marginTop: 10 }]}
                onPress={handleGoogleLogin}
            >
                <Text style={styles.buttonText}>SIGN IN WITH GOOGLE</Text>
            </TouchableOpacity> */}
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