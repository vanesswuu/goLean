import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
//our carousel component
import FeatureCarousel from '../components/FeatureCarousel';

const WelcomeScreen = ({ navigation }) => {



    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>


            <View style={styles.carouselContainer}>
                <FeatureCarousel />
            </View>

            <View style={styles.bottomContainer}>

                <Text style={styles.logoText}>goLean</Text>
                <Text style={styles.subtitle}>Welcome to the club!</Text>


                <TouchableOpacity style={styles.signupButton} onPress={() =>
                    navigation.navigate('NameScreen')
                }>
                    <Text style={styles.signupButtonText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={() =>
                    navigation.navigate('Login')
                }>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

            </View>

        </ScrollView >

    );

    //end of welcome screen component
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
    },
    carouselContainer: {
    },
    bottomContainer: {
        justifyContent: 'center',
        paddingHorizontal: 25,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30, // Gives a nice curve over the picture
        borderTopRightRadius: 30,
        marginTop: -30, // Pulls the white box UP slightly over the image
    },
    logoText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#1e272e',
        textAlign: 'center',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: '#808e9b',
        textAlign: 'center',
        marginBottom: 30,
    },
    signupButton: {
        backgroundColor: '#1e272e', // A very dark, sleek gray/black
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    signupButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loginButton: {
        padding: 15,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#808e9b',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
export default WelcomeScreen;