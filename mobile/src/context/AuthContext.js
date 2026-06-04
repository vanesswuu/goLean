//for global storage
//for auth
//for the app to remember who's logged in

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    requestNotificationPermissions,
    scheduleDailyReminder,
    scheduleWeeklyReminder,
    cancelAllReminders,
    scheduleTestNotification
} from '../utils/notificationService';
import { saveNotificationAPI } from '../services/notificationApiService';
import * as Notifications from 'expo-notifications';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    const setupNotifications = async () => {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
            await scheduleDailyReminder();
            await scheduleWeeklyReminder();
        }
    }




    useEffect(() => {

        const loadStoredUser = async () => {

            try {
                const storedUser = await AsyncStorage.getItem('user');

                if (storedUser) {
                    // We turn the text back into a real JS object!
                    setUser(JSON.parse(storedUser));
                    await setupNotifications();
                    await scheduleTestNotification();
                }
            } catch (error) {
                console.log('failed to load user');
            } finally {
                setisLoading(false);
            }

        }
        loadStoredUser();
    }, []);


    useEffect(() => {
        if (!user?.token) return;
        // Saves any foreground notification to database
        const receivedListener = Notifications.addNotificationReceivedListener(
            async (notification) => {
                const { title, body } = notification.request.content;
                const expoId = notification.request.identifier;
                try {
                    await saveNotificationAPI({ title, body, expoId }, user.token);
                } catch (error) {
                    console.warn('Failed to save received notification globally', error);
                }
            }
        );
        // Saves any notification tapped from background/killed state to database
        const responseListener = Notifications.addNotificationResponseReceivedListener(
            async (response) => {
                const { title, body } = response.notification.request.content;
                const expoId = response.notification.request.identifier;
                try {
                    await saveNotificationAPI({ title, body, expoId }, user.token);
                } catch (error) {
                    console.warn('Failed to save tapped notification globally', error);
                }
            }
        );
        return () => {
            receivedListener.remove();
            responseListener.remove();
        };
    }, [user]);

    const login = async (userData) => {

        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await setupNotifications();
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        await cancelAllReminders();
    }

    const updateUser = async (updatedUserData) => {
        setUser(updatedUserData);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
    }
    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);