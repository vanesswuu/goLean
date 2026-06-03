import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { getUnreadNotificationCount } from '../utils/notificationService';

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
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const count = await getUnreadNotificationCount();
                setUnreadCount(count);
            } catch (e) {
                console.warn('Failed to load notification count', e);
            }
        }

        fetchCount();
        const unsubscribe = navigation.addListener('focus', fetchCount);
        return unsubscribe;
    }, [navigation])

    return (

        <View style={styles.header}>

            <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate('Profile')}>

                <Ionicons name='person' size={24} color='#57606f' />

            </TouchableOpacity>


            <TouchableOpacity

                onPress={() => navigation.navigate('Notifications')}
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