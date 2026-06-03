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

import ProfileScreen from '../screens/ProfileScreen';

//imports for plus button modal
import RunTrackerScreen from '../screens/RunTrackerScreen';
import TransformationScreen from '../screens/TransformationScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

import { useAuth } from '../context/AuthContext';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';



const Stack = createStackNavigator();

// GoogleSignin.configure({
//     webClientId: '444145239546-3eear1pdmjig05u67v6vfhthr7k931dd.apps.googleusercontent.com',
//     offlineAccess: true,
// });

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

                        <>
                            <Stack.Screen name="Main" component={MainTabNavigator} />
                            <Stack.Screen name="RunTracker" component={RunTrackerScreen}
                                options={{ headerShown: true, title: 'Run Tracker', headerBackTitle: 'Back' }}
                            />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                            <Stack.Screen name='Transformation' component={TransformationScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Transformation vault',
                                    headerBackTitle: 'Back',
                                }}
                            />
                            <Stack.Screen name='Notifications' component={NotificationsScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Notifications',
                                    headerBackTitle: 'Back'
                                }}
                            />
                        </>

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