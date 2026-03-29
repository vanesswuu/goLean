//this file handles the logic for switching between screens

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

//screen imports
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>

            <Stack.Navigator
                initialRouteName="Welcome" // the first page to appear 
                screenOptions={{ headerShown: false }} // this says// hide header in every page
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />

            </Stack.Navigator>

        </NavigationContainer>
    );




    //end of app navigator component
};

export default AppNavigator;