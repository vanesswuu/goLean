import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Image,
    Alert, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { uploadPhotoAPI, getPhotosAPI } from '../services/photoService';
import ImageComparisonSlider from '../components/transformation/ImageComparisonSlider';
const SERVER_BASE = 'http://192.168.254.122:5000';


const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 25;

export default function TransformationScreen() {

    const [photos, setPhotos] = useState([]);
    const { user } = useAuth();
    const [compareSet, setCompareSet] = useState([]);

    //this fetches the photos when the screen loads
    useEffect(() => {

        if (user?.token) {
            loadPhotos();
        }

    }, [user]);

    const loadPhotos = async () => {
        if (!user?.token) return;

        try {
            const dbPhotos = await getPhotosAPI(user.token);
            setPhotos(dbPhotos);
        } catch (error) {
            console.log('error loading photos: ', error)
        }

    };

    const handleAddPhoto = async () => {
        //1. ask for permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Needed',
                'We need camera access to track your progress!');
            return;
        }

        //2. Launch Camera
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 5], //this will be good for body shots
            quality: 0.7,
        });

        if (!result.canceled) {
            //we send the payload to the server/database here
            const payload = {
                imageUri: result.assets[0].uri,
                weight: user.weight
            }

            try {

                const savedPhoto = await uploadPhotoAPI(payload, user.token);

                setPhotos([savedPhoto, ...photos]);
                setCompareSet([]);

            } catch (error) {
                console.error('error saving photo:', error);
                Alert.alert('Upload Failed', 'Could not save photo');
            };

        }
    };

    const toggleCompare = (photo) => {

        const alreadySelected = compareSet.some((p) => p._id === photo._id);
        if (alreadySelected) {
            setCompareSet(compareSet.filter((p) => p._id !== photo._id));
        } else if (compareSet.length < 2) {
            setCompareSet([...compareSet, photo]);
        }
        // ignore taps when two are already selected
    }

    return (

        <View style={styles.container}>

            <View style={styles.headerInfo}>
                <Text style={styles.subtitle}>
                    Track your physical evolution
                </Text>
            </View>
            {/* float action button */}
            <TouchableOpacity style={styles.fab} onPress={handleAddPhoto}>
                <Ionicons name='camera' size={30} color='#fff' />
                <Text style={styles.buttonText}>Add Photo</Text>
            </TouchableOpacity>
            {/* this loops through and renders the photos state */}
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainer={styles.grid}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.photoCard} onPress={() => toggleCompare(item)}>

                        <Image source={{ uri: `${SERVER_BASE}${item.imageUrl}` }}
                            style={[styles.image,
                            compareSet.find((p) => p._id === item._id) && {
                                borderColor: '#0a84ff',
                                borderWidth: 2,
                            },
                            ]} />
                        <View style={styles.dateBadge}>
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>

                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="camera-outline" size={80} color="#dcdde1" />
                        <Text style={styles.emptyText}>No progress photos yet.</Text>
                        <Text style={styles.emptySubtext}>Your first photo is the hardest part!</Text>
                    </View>
                }
            />



            {/* added: comparison slider – only when exactly two photos are selected */}
            {compareSet.length === 2 && (
                <ImageComparisonSlider
                    beforeUri={`${SERVER_BASE}${compareSet[0].imageUrl}`}
                    afterUri={`${SERVER_BASE}${compareSet[1].imageUrl}`} />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    headerInfo: {
        marginBottom: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginTop: 4,
    },
    // ── FAB style ──
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#0a84ff',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 10,
    },
    // optional regular button you might still use elsewhere
    button: {
        flexDirection: 'row',
        backgroundColor: '#0a84ff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 16,
    },
    grid: {
        paddingBottom: 30,
    },
    photoCard: {
        width: COLUMN_WIDTH,
        margin: 5,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    dateBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    dateText: {
        color: '#fff',
        fontSize: 12,
    },
});
