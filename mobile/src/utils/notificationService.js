import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are displayed when the app is open
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// 1. Request Permission from user
export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted!');
        return false;
    }

    // Required channel setup for Android devices
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return true;
};

// 2. Schedule Daily Log Reminder (e.g., at 8:00 PM every day)
export const scheduleDailyReminder = async () => {
    // Clear scheduled ones first to prevent duplicates
    await cancelAllReminders();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Log Your Progress 🥗",
            body: "Time to check in! Don't forget to log your daily weight and meals.",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 20, // 8:00 PM (24-hour format)
            minute: 0,
        },
    });
    console.log('Daily logging reminder scheduled for 8:00 PM');
};

// 3. Schedule Weekly Progress Photo Reminder (e.g., Sundays at 10:00 AM)
export const scheduleWeeklyReminder = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Vault Check-in 📸",
            body: "Weekly milestone! Update your Transformation Vault with a new progress photo.",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: 1, // Sunday (1 corresponds to Sunday in this API)
            hour: 10,   // 10:00 AM
            minute: 0,
        },
    });
    console.log('Weekly vault reminder scheduled for Sundays at 10:00 AM');
};

// 4. Cancel all reminders (used during logout)
export const cancelAllReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled.');
};

export const scheduleTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Test Notification! 🚀",
            body: "This is a test local notification from goLean. It works!",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5, // Triggers in 5 seconds
        },
    });
    console.log('Test notification scheduled in 5 seconds.');
};
