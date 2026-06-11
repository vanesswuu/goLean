import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Polyline, Marker } from 'react-native-maps'; // 1. Import Maps
import { calculateDistance } from '../utils/calculations';
import * as Notifications from 'expo-notifications';

//utils
import { formatTime } from '../utils/runCalculations';

//service
import { saveRunAPI } from '../services/runLogService';

//auth context
import { useAuth } from '../context/AuthContext';

export default function RunTrackerScreen() {

    const { user } = useAuth();

    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false); // 2. New state for Summary

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [distance, setDistance] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [route, setRoute] = useState([]); // 3. New state to store every coordinate

    const timerRef = useRef(null); //interval id
    const locationRef = useRef(null);
    const lastPosRef = useRef(null); //last position, to track distance. accumulated from every prev dist

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'GPS is required to track runs!');
            }
        })();
    }, []);

    //to start and stop run
    const toggleRun = async () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsFinished(false);

            timerRef.current = setInterval(() => {   //interval id
                setTimeElapsed((prev) => {
                    const newTime = prev + 1;
                    setSpeed((distance / (newTime / 3600)).toFixed(2));
                    return newTime;
                });
            }, 1000);

            locationRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 2000,
                    distanceInterval: 1
                },
                (location) => {

                    const { latitude, longitude } = location.coords;
                    const newPos = { latitude, longitude };

                    // 4. Update the breadcrumb trail
                    setRoute((prev) => [...prev, newPos]);

                    if (lastPosRef.current) {
                        const distAdded = calculateDistance(
                            lastPosRef.current.latitude,
                            lastPosRef.current.longitude,
                            latitude,
                            longitude
                        );
                        setDistance((prev) => prev + distAdded);
                    }
                    lastPosRef.current = newPos;
                }
            );

        } else {

            setIsRunning(false);
            clearInterval(timerRef.current);
            if (locationRef.current) {
                locationRef.current.remove();
            }

        }
    };

    //to finish run session
    const finishRun = () => {
        setIsFinished(true); // 5. Toggle to Map Summary
        setIsRunning(false);
        clearInterval(timerRef.current);
        if (locationRef.current) {
            locationRef.current.remove();
        }
    }

    //to click done amd save run and reset tracker
    const resetTracker = async () => {

        const runData = {
            distance,
            timeElapsed,
            speed,
            date: new Date().toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
            }),
        };
        try {
            const data = await saveRunAPI(runData, user.token);

            if (data.notifications && data.notifications.length > 0) {

                for (const notif of data.notifications) {
                    await Notifications.scheduleNotificationAsync({

                        content: {
                            title: notif.title,
                            body: notif.body
                        },
                        trigger: null

                    })
                }

            }

            setDistance(0);
            setTimeElapsed(0);
            setSpeed(0);
            setRoute([]);
            setIsFinished(false);
            lastPosRef.current = null;
            Alert.alert("Run Session saved to history");

        } catch (error) { //tweak,fix and study error here
            console.error("Save failed:", error);
            Alert.alert("Error", "Could not save your run. Please try again.");
        }




    }

    // 6. Conditional Rendering: Show Map if Finished, otherwise show Tracker
    if (isFinished) {
        return (
            <View style={styles.container}>

                <Text style={styles.headerTitle}>Run Summary</Text>

                {/*the map sumaary */}
                <View style={styles.mapContainer}>

                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: route.length > 0 ? route[0].latitude : 0,
                            longitude: route.length > 0 ? route[0].longitude : 0,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        {/*  <Polyline>. 
                            This takes our GPS array normally and draws
                             the green snake line. */}
                        {route.length > 0 && (
                            <Polyline
                                coordinates={route}
                                strokeColor="#2ed573"
                                strokeWidth={6}
                                lineCap="round"
                                lineJoin="round"
                            />
                        )}

                        {/*  <Marker> tags. 
                            We still wrap custom styles.dot inside it so 
                            it looks identical to before. */}
                        {route.length > 0 && (
                            <Marker
                                coordinate={route[0]}
                                title="Start"
                            >
                                <View style={[styles.dot, { backgroundColor: '#2ed573' }]} />
                            </Marker>
                        )}

                        {route.length > 1 && (
                            <Marker
                                coordinate={route[route.length - 1]}
                                title="End"
                            >
                                <View style={[styles.dot, { backgroundColor: '#ff4757' }]} />
                            </Marker>
                        )}

                    </MapView>


                </View>

                <View style={[styles.row, { marginTop: 20 }]}>

                    <View style={styles.statsBoxSmall}>
                        <Text style={styles.valueSmall}>{distance.toFixed(2)}</Text>
                        <Text style={styles.label}>KM</Text>
                    </View>
                    <View style={styles.statsBoxSmall}>
                        <Text style={styles.valueSmall}>{formatTime(timeElapsed)}</Text>
                        <Text style={styles.label}>Time</Text>
                    </View>

                </View>

                <TouchableOpacity style={styles.btnReset} onPress={resetTracker}>
                    <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.statsBox}>
                <Text style={styles.value}>{distance.toFixed(2)}</Text>
                <Text style={styles.label}>Kilometers</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.statsBoxSmall}>
                    <Text style={styles.valueSmall}>{formatTime(timeElapsed)}</Text>
                    <Text style={styles.label}>Time</Text>
                </View>
                <View style={styles.statsBoxSmall}>
                    <Text style={styles.valueSmall}>{isNaN(speed) ? "0.00" : speed}</Text>
                    <Text style={styles.label}>Avg km/h</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, isRunning ? styles.btnStop : styles.btnStart]}
                onPress={toggleRun}
            >
                <Text style={styles.buttonText}>{isRunning ? '| |' : 'Start'}</Text>
            </TouchableOpacity>

            {!isRunning && timeElapsed > 0 && (
                <TouchableOpacity style={styles.btnFinish} onPress={finishRun}>
                    <Text style={styles.buttonText}>Finish</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', alignItems: 'center', paddingTop: 50 },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#2f3542', marginBottom: 20 },
    statsBox: { alignItems: 'center', marginBottom: 40 },
    value: { fontSize: 80, fontWeight: '900', color: '#2f3542' },
    label: { fontSize: 18, fontWeight: 'bold', color: '#a4b0be', textTransform: 'uppercase' },
    row: { flexDirection: 'row', width: '80%', justifyContent: 'space-between', marginBottom: 60 },
    statsBoxSmall: { alignItems: 'center' },
    valueSmall: { fontSize: 40, fontWeight: '800', color: '#2f3542' },
    button: { width: 100, height: 100, borderRadius: 100, justifyContent: 'center', alignItems: 'center', elevation: 10 },
    btnStart: { backgroundColor: '#2ed573' },
    btnStop: { backgroundColor: '#ff4757' },
    btnFinish: { marginTop: 30, backgroundColor: '#2f3542', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
    btnReset: { marginTop: 50, backgroundColor: '#747d8c', paddingVertical: 15, paddingHorizontal: 80, borderRadius: 30 },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '900' },
    mapContainer: {
        width: Dimensions.get('window').width * 0.9,
        height: 350,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    map: { flex: 1 },
    dot: {
        width: 15,
        height: 15,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#fff'
    }
});
