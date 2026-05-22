import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Image,
    Alert, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

//service imports
import { useAuth } from '../context/AuthContext';
import { uploadPhotoAPI, getPhotosAPI } from '../services/photoService';



const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 25;

export default function TransformationScreen() {

    const [photos, setPhotos] = useState([]);
    const { user } = useAuth();


    //this fetches the photos when the screen loads
    useEffect(() => {

        if (user?.token) {
            loadPhotos();
        }

    }, [user]);

    const loadPhotos = async () => {

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

            } catch (error) {
                console.error('error saving photo:', error);
                Alert.alert('Upload Failed', 'Could not save photo');
            };

        }
    };

    return (

        <View style={styles.container}>

            <View style={styles.headerInfo}>
                <Text style={styles.subtitle}>
                    Track your physical evolution
                </Text>
            </View>

            {/* this loops through and renders the photos state */}
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainer={styles.grid}
                renderItem={({ item }) => (
                    <View style={styles.photoCard}>

                        <Image source={{ uri: `http://192.168.1.21:5000${item.imageUrl}` }}
                            style={styles.image} />
                        <View style={styles.dateBadge}>
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>

                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="camera-outline" size={80} color="#dcdde1" />
                        <Text style={styles.emptyText}>No progress photos yet.</Text>
                        <Text style={styles.emptySubtext}>Your first photo is the hardest part!</Text>
                    </View>
                }
            />

            {/* float action button */}
            <TouchableOpacity style={styles.fab} onPress={handleAddPhoto}>
                <Ionicons name='camera' size={30} color='#fff' />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    headerInfo: { padding: 20, backgroundColor: '#fff' },
    subtitle: { fontSize: 16, color: '#a4b0be', fontWeight: '500' },
    grid: { padding: 15 },
    photoCard: {
        width: COLUMN_WIDTH,
        height: COLUMN_WIDTH * 1.2,
        backgroundColor: '#fff',
        borderRadius: 20,
        margin: 5,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
    },
    image: { width: '100%', height: '100%' },
    dateBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(47, 53, 66, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    dateText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#2f3542', marginTop: 20 },
    emptySubtext: { color: '#a4b0be', marginTop: 5 },
    fab: {
        position: 'absolute',
        right: 25,
        bottom: 25,
        backgroundColor: '#2ed573',
        width: 65,
        height: 65,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#2ed573',
        shadowOpacity: 0.4,
        shadowRadius: 10,
    }
});