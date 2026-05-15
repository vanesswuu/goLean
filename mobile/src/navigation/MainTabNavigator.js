//this file handles the navigation tabs at the bottom after user login

import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // We use these for icons!
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


//more options imports
import HistoryScreen from '../screens/HistoryScreen'
import { useAuth } from '../context/AuthContext'

import DashboardScreen from '../screens/DashboardScreen';

const Placeholder = ({ name }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{name} Screen Placeholder</Text>
    </View>
);

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const navigation = useNavigation();


    const { logout } = useAuth();
    const [menuVisible, setMenuVisible] = useState(false);
    const [plusVisible, setPlusVisible] = useState(false);

    return (

        <View style={{ flex: 1 }}>

            {/*<<<<<<<<<<<<<<<  START OF TAB NAV    >>>>>>>>>>>>>>>>>>>> */}
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

                        return <Ionicons name={iconName} size={30} color={color} />;


                    }


                })}
            >
                <Tab.Screen name="Dashboard" component={DashboardScreen} />

                {/*intercepted tabs, these dont go to screens, they open modals */}
                <Tab.Screen
                    name="Add"
                    component={DashboardScreen}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            setPlusVisible(true);
                        }
                    }}
                />

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

                {/*this tab is just hidden, i cant click it. but it holds the history screen component */}
                <Tab.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        tabBarItemStyle: { display: 'none' },
                        headerShown: true,
                        headerBackTitle: 'Back',
                        title: 'History'
                    }}
                />

            </Tab.Navigator>
            {/*<<<<<<<<<<<<<<<   END OF TAB NAV    >>>>>>>>>>>>>>>>>>>> */}



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
                                navigation.navigate('Main', { screen: 'History' });
                            }}
                        >

                            <Text style={styles.menuItemText}>My History</Text>
                            <Ionicons name="chevron-forward" size={18} color="#a4b0be" />

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            activeOpacity={1}
                            onPress={() => {
                                logout();
                            }}

                        >
                            <Text>Logout</Text>
                        </TouchableOpacity>


                    </View>

                </TouchableOpacity>


            </Modal>

            {/*modal for plus button, run tracker modal */}
            <Modal
                visible={plusVisible}
                transparent={true}
                animationType='slide'
                onRequestClose={() =>
                    setPlusVisible(false)
                }
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setPlusVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.handle} />
                        <Text style={styles.menuTitle}>Choose Activity</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <View style={styles.squareRow}>

                                <TouchableOpacity
                                    style={styles.squareButton}
                                    onPress={() => {
                                        setPlusVisible(false);
                                        navigation.navigate('RunTracker');
                                    }}
                                >
                                    <Ionicons name="footsteps-outline" size={45} color="#2f3542" />
                                    <Text style={styles.squareButtonText}>Run Tracker</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.squareButton}
                                    onPress={() => {
                                        setPlusVisible(false);
                                        navigation.navigate('Transformation');
                                    }}
                                >
                                    <Ionicons name="camera-outline" size={40} color="#2f3542" />
                                    <Text style={styles.squareButtonText}>Progress Photos</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>

                </TouchableOpacity>

            </Modal>

        </View >
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

    squareButton: {
        width: '48%',
        aspectRatio: 1, // This forces it to be a perfect square!
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    squareButtonText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2f3542',
        textAlign: 'center'
    },
    squareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    squareButton: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#f8f9fa', // Clean off-white
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f2f6', // Very subtle border
    },
    squareButtonText: {
        marginTop: 15,
        fontSize: 15,
        fontWeight: '700',
        color: '#2f3542',
        textAlign: 'center',
    },
});