import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { calculateDistance } from '../utils/calculations';

// This is a free demo style that doesn't require a key or credit card.
const MAP_STYLE = 'https://demotiles.maplibre.org/style.json';

export default function RunTrackerScreen() {
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const [timeElapsed, setTimeElapsed] = useState(0);
    const [distance, setDistance] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [route, setRoute] = useState([]);

    const timerRef = useRef(null);
    const locationRef = useRef(null);
    const lastPosRef = useRef(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'GPS is required to track runs!');
            }
        })();
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const toggleRun = async () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsFinished(false);

            timerRef.current = setInterval(() => {
                setTimeElapsed((prev) => {
                    const newTime = prev + 1;
                    // Prevent divide by zero
                    const hours = newTime / 3600;
                    setSpeed(hours > 0 ? (distance / hours).toFixed(2) : "0.00");
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

    const finishRun = () => {
        setIsFinished(true);
        setIsRunning(false);
        clearInterval(timerRef.current);
        if (locationRef.current) {
            locationRef.current.remove();
        }
    }

    const resetTracker = () => {
        setDistance(0);
        setTimeElapsed(0);
        setSpeed(0);
        setRoute([]);
        setIsFinished(false);
        lastPosRef.current = null;
    }

    // SUMMARY VIEW (MAP)
    if (isFinished) {
        return (
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Run Summary</Text>

                <View style={styles.mapContainer}>

                    <MapLibreGL.MapView
                        style={styles.map}
                        styleURL={MAP_STYLE}
                        logoEnabled={false}
                        attributionEnabled={false}
                    >
                        <MapLibreGL.Camera
                            zoomLevel={15}
                            centerCoordinate={[route[0]?.longitude || 0, route[0]?.latitude || 0]}
                            animationMode={'flyTo'}
                            animationDuration={2000}
                        />

                        {/* The Trail */}
                        <MapLibreGL.ShapeSource id="routeSource" shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: route.map(p => [p.longitude, p.latitude])
                            }
                        }}>
                            <MapLibreGL.LineLayer id="routeLayer" style={{
                                lineColor: '#2ed573',
                                lineWidth: 6,
                                lineJoin: 'round',
                                lineCap: 'round'
                            }} />
                        </MapLibreGL.ShapeSource>

                        {/* Start Point */}
                        {route.length > 0 && (
                            <MapLibreGL.PointAnnotation
                                id="start"
                                coordinate={[route[0].longitude, route[0].latitude]}
                            >
                                <View style={[styles.dot, { backgroundColor: '#2ed573' }]} />
                            </MapLibreGL.PointAnnotation>
                        )}

                        {/* End Point */}
                        {route.length > 1 && (
                            <MapLibreGL.PointAnnotation
                                id="end"
                                coordinate={[route[route.length - 1].longitude, route[route.length - 1].latitude]}
                            >
                                <View style={[styles.dot, { backgroundColor: '#ff4757' }]} />
                            </MapLibreGL.PointAnnotation>
                        )}

                    </MapLibreGL.MapView>
                    
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

    // TRACKER VIEW (DASHBOARD)
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
                <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
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
        borderColor: '#eee',
        backgroundColor: '#e0e0e0'
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
