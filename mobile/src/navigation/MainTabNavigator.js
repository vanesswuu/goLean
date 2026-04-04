//this file handles the navigation tabs at the bottom after user login

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // We use these for icons!
import { View, Text } from 'react-native';


import DashboardScreen from '../screens/DashboardScreen';

const Placeholder = ({ name }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{name} Screen Placeholder</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#2ed573',
                tabBarInactiveTintColor: '#a4b0be',
                tabBarStyle: { height: 70, padding: 14 },
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => {

                    let iconName;
                    if (route.name === 'More') iconName = 'menu';
                    else if (route.name === 'Add') iconName = 'add-circle';
                    else if (route.name === 'Dashboard') iconName = 'home';

                    return <Ionicons name={iconName} size={40} color={color} />;


                }


            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Add" component={DashboardScreen} />
            <Tab.Screen name="More" component={DashboardScreen} />

        </Tab.Navigator>
    );
}
