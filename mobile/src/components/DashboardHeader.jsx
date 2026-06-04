import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { useNavigation } from '@react-navigation/native';
import { getNotificationsAPI } from '../services/notificationApiService';
import { useAuth } from '../context/AuthContext';


const Badge = ({ count }) => (
    <View
        style={{
            position: 'absolute',
            right: -6,
            top: -6,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#ff3b30',   // bright red
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
        }}
    >
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
            {count > 99 ? '99+' : count}
        </Text>
    </View>
);


export default function DashboardHeader() {

    const navigation = useNavigation();
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                if (user?.token) {
                    const data = await getNotificationsAPI(user.token);
                    const unread = data.filter(n => !n.isRead).length;
                    setUnreadCount(unread);
                }

            } catch (e) {
                console.warn('Failed to load notification count', e);
            }
        }

        fetchCount();

        const unsubscribeFocus = navigation.addListener('focus', fetchCount);

        const receivedListener = Notifications.addNotificationReceivedListener(() => {
            setUnreadCount((prev) => prev + 1); // Instant local UI update
        });

        return () => {
            unsubscribeFocus();
            receivedListener.remove();
        };
    }, [navigation, user])

    return (

        <View style={styles.header}>

            <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate('Profile')}>

                <Ionicons name='person' size={24} color='#57606f' />

            </TouchableOpacity>


            <TouchableOpacity

                onPress={() => {
                    setUnreadCount(0);
                    navigation.navigate('Notifications')
                }}
            >

                <Ionicons name='notifications-outline' size={28} color='#2f3542' />
                {unreadCount > 0 && <Badge count={unreadCount} />}

            </TouchableOpacity>

        </View>





    );

}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 50, // Standard padding to clear the notch
        backgroundColor: '#fff',
    },
    profileCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ced6e0'
    }
});