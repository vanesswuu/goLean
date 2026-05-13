//for global storage
//for auth
//for the app to remember who's logged in

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {

        const loadStoredUser = async () => {

            try {
                const storedUser = await AsyncStorage.getItem('user');

                if (storedUser) {
                    // We turn the text back into a real JS object!
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.log('failed to load user');
            } finally {
                setisLoading(false);
            }

        }
        loadStoredUser();
    }, []);

    const login = async (userData) => {

        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));

    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
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