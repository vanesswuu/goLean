//this file handles the logic for switching between screens for login, signup and onboarding

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './MainTabNavigator';

//default screen imports
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';


//onboarding screens
import NameScreen from '../screens/NameScreen';
import GoalScreen from '../screens/GoalScreen';
import BarrierScreen from '../screens/BarrierScreen';
import ActivityScreen from '../screens/ActivityScreen';
import MetricsScreen from '../screens/MetricsScreen';
import SummaryScreen from '../screens/SummaryScreen';
import EmpathyResponseScreen from '../screens/EmpathyResponseScreen';
import DashboardScreen from '../screens/DashboardScreen';

import { useAuth } from '../context/AuthContext';



const Stack = createStackNavigator();

function AppNavigator() {

    const { user, isLoading } = useAuth();

    if (isLoading) return null;


    return (
        <NavigationContainer>

            <Stack.Navigator
                screenOptions={{ headerShown: false }}
            >

                {user ?
                    (
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                    ) :

                    (
                        <>
                            <Stack.Screen name="Welcome" component={WelcomeScreen} />
                            <Stack.Screen name="Login" component={LoginScreen} />

                            <Stack.Screen name="NameScreen" component={NameScreen} options={{ headerShown: true, title: '' }} />
                            <Stack.Screen name="Goal" component={GoalScreen} options={{ headerShown: true, title: '' }} />
                            <Stack.Screen name="Barrier" component={BarrierScreen} options={{ headerShown: true, title: '' }} />
                            <Stack.Screen name="Activity" component={ActivityScreen} options={{ headerShown: true, title: '' }} />
                            <Stack.Screen name="Metrics" component={MetricsScreen} options={{ headerShown: true, title: '' }} />

                            <Stack.Screen name="EmpathyResponse" component={EmpathyResponseScreen} options={{ headerShown: true, title: '' }} />


                            <Stack.Screen name="Summary" component={SummaryScreen} options={{ headerShown: true, title: '' }} />
                            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: true, title: '' }} />
                        </>
                    )

                }








            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default AppNavigator;