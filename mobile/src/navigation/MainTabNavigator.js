//this file handles the navigation tabs at the bottom after user login

import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // We use these for icons!
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


//more options imports
import HistoryScreen from '../screens/HistoryScreen'


import DashboardScreen from '../screens/DashboardScreen';

const Placeholder = ({ name }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{name} Screen Placeholder</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const navigation = useNavigation();

    const [menuVisible, setMenuVisible] = useState(false);

    return (

        <View style={{ flex: 1 }}>


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

                {/*intercepted tabs, these dont go to screens, they open modals */}
                <Tab.Screen name="Add" component={DashboardScreen} />

                <Tab.Screen
                    name="More"
                    component={DashboardScreen}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            setMenuVisible(true);
                        }
                    }}
                />

                <Tab.Screen
                    name="Historyy"
                    component={HistoryScreen}
                    options={{
                        tabBarItemStyle: { display: 'none' },
                        headerShown: true,
                        title: 'History'
                    }}
                />

            </Tab.Navigator>

            {/*modal for menus in more button */}
            <Modal
                transparent={true}
                visible={menuVisible}
                animationType='slide'
                onRequestClose={() => setMenuVisible(false)}
            >

                {/*modal overlay */}
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() =>
                        setMenuVisible(false)}
                >

                    {/*modal menu container */}
                    <View style={styles.menuContainer}>
                        <View style={styles.handle} />
                        <Text style={styles.menuTitle}>More Options</Text>

                        <TouchableOpacity
                            style={styles.menuItem}
                            activeOpacity={1}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate('Main', { screen: 'Historyy' });
                            }}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name='time' size={22} color="#2f3542" />
                            </View>
                            <Text style={styles.menuItemText}>My History</Text>
                            <Ionicons name="chevron-forward" size={18} color="#a4b0be" />

                        </TouchableOpacity>



                    </View>

                </TouchableOpacity>


            </Modal>

        </View>
    );
}


const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    menuContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 50
    },
    handle: { width: 40, height: 5, backgroundColor: '#f1f2f6', borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
    menuTitle: { fontSize: 18, fontWeight: '900', color: '#2f3542', marginBottom: 20, textAlign: 'center' },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 20,
        marginBottom: 10
    },
    iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuItemText: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#2f3542' },
});