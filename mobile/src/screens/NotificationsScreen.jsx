import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity,
    ActivityIndicator, RefreshControl
} from 'react-native';
import * as Notifications from 'expo-notifications';
import {
    requestNotificationPermissions,
    scheduleTestNotification
} from '../utils/notificationService';
import { useAuth } from '../context/AuthContext';
import { saveNotificationAPI, getNotificationsAPI } from '../services/notificationApiService';

export default function NotificationsScreen() {

    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadNotifications = async () => {
        try {

            const data = await getNotificationsAPI(user.token);
            setNotifications(data);

        } catch (e) {
            console.warn('Failed to fetch notifications', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }


    //request notification permissions
    useEffect(() => {
        (async () => {
            const granted = await requestNotificationPermissions();
            if (granted) {
                await loadNotifications();
            } else {
                setLoading(false);
            }
        })();

        const receivedListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                const { title, body } = notification.request.content;
                const expoId = notification.request.identifier;


                if (user?.token) {
                    saveNotificationAPI({ title, body, expoId }, user.token)
                        .then(() => loadNotifications());
                }
            }
        );

        const responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const { title, body } = response.notification.request.content;
                const expoId = response.notification.request.identifier;

                if (user?.token) {
                    saveNotificationAPI({ title, body, expoId }, user.token)
                        .then(() => loadNotifications());
                }
            }
        );

        return () => {
            receivedListener.remove();
            responseListener.remove();
        }

    }, [])




    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2ed573" />
            </View>
        );
    }

    return (


        <View style={styles.container}>

            <View style={styles.header}>

                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity
                    style={styles.testBtn}
                    onPress={scheduleTestNotification}
                >
                    <Text>Test Notification</Text>
                </TouchableOpacity>

            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>No scheduled notifications</Text>
                    <Text style={styles.emptySubtitle}>
                        Pull down to refresh or tap ‘Test Notification’ to create one.
                    </Text>
                </View>

            ) : (

                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}


        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#2f3542',
    },
    testBtn: {
        backgroundColor: '#2ed573',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    testBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2f3542',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#747d8c',
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 30,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2f3542',
        marginBottom: 4,
    },
    body: {
        fontSize: 14,
        color: '#57606f',
    },
});