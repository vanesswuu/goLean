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
import API_BASE from '../config';

const SERVER_BASE = API_BASE;

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 25

export default function TransformationScreen() {

    const { user } = useAuth();
    const [photos, setPhotos] = useState([]);
    const [selectMode, setSelectMode] = useState(false);
    const [compareSet, setCompareSet] = useState([]);
    const [showSlider, setShowSlider] = useState(false);

    //fetch photos on mount/when user changes
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
            console.log('error loading photos', error);
        }
    };

    const handleAddPhoto = async () => {
        //1. ask camera permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Needed', 'We need camera access to track your progress')
            return;
        }

        //2. launch camera if granted
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.7,
        })

        if (!result.canceled) {

            const payload = {
                imageUri: result.assets[0].uri,
                weight: user.weight,
            };

            try {
                await uploadPhotoAPI(payload, user.token);
                await loadPhotos();
                setCompareSet([]);
            } catch (error) {
                console.error('error saving photo: ', error);
                Alert.alert('Upload Failed', 'Could not save photo');
            }
        }

    };

    //toggle select mode on/off
    const handleToggleSelectMode = () => {
        setSelectMode(!selectMode);
        setCompareSet([]);
    };

    //tag a photo to select/deselect
    const toggleCompare = (photo) => {
        if (!selectMode) return;

        const alreadySelected = compareSet.some(p => p._id === photo._id);
        if (alreadySelected) {
            setCompareSet(compareSet.filter(p => p._id !== photo._id));
        } else if (compareSet.length < 2) {

            const newSet = [...compareSet, photo];
            setCompareSet(newSet);

            //auto-open the slider when 2 are selected
            if (newSet.length === 2) setShowSlider(true);
        }
    };

    const handleCloseSlider = () => {
        setShowSlider(false);
        setCompareSet([]);
        setSelectMode(false);
    };


    return (

        <View style={styles.container}>
            {/* header */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Transformation Vault</Text>
                    <Text style={styles.subtitle}>Track your physical evolution</Text>
                </View>

                <TouchableOpacity style={[styles.selectBtn, selectMode && styles.selectBtnActive]}
                    onPress={handleToggleSelectMode}
                >
                    <Text style={[styles.selectBtnText, selectMode && styles.selectBtnTextActive]}>
                        {selectMode ? 'Cancel' : 'Select'}
                    </Text>

                </TouchableOpacity>
            </View>

            {/* hint text */}
            {selectMode && (
                <Text style={styles.selectHint}>
                    {compareSet.length === 0 && 'Select two photos to compare'}
                    {compareSet.length === 1 && 'Select one more photo'}
                    {compareSet.length === 2 && 'Opening comparison'}
                </Text>
            )}

            {/* render photos */}
            <FlatList
                data={photos}
                keyExtractor={(item) => String(item._id ?? item.id)}
                numColumns={2}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => {
                    const isSelected = compareSet.some(p => p._id === item._id);

                    return (
                        <TouchableOpacity
                            style={[styles.photoCard, isSelected && styles.photoCardSelected]}
                            onPress={() => toggleCompare(item)}
                        >
                            <Image source={{ uri: `${SERVER_BASE}${item.imageUrl}` }}
                                style={styles.image}
                            />

                            {/*checkmark badge after select */}
                            {isSelected && (
                                <View style={styles.checkBadge}>
                                    <Ionicons name='checkmark' size={16} color="#fff" />
                                </View>
                            )}

                            <View style={styles.dateBadge}>
                                <Text style={styles.dateText}>{item.date}</Text>
                            </View>

                        </TouchableOpacity>
                    );

                }}

                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="camera-outline" size={80} color="#dcdde1" />
                        <Text style={styles.emptyText}>No progress photos yet.</Text>
                        <Text style={styles.emptySubtext}>Your first photo is the hardest part!</Text>
                    </View>
                }
            />

            {/* add photo button */}
            <TouchableOpacity style={styles.fab} onPress={handleAddPhoto}>
                <Ionicons name='camera' size={28} color='#fff' />
            </TouchableOpacity>

            {/* comparison modal */}
            {showSlider && compareSet.length === 2 && (
                <ImageComparisonSlider
                    beforeUri={`${SERVER_BASE}${compareSet[0].imageUrl}`}
                    afterUri={`${SERVER_BASE}${compareSet[1].imageUrl}`}
                    onClose={handleCloseSlider}
                />
            )}

        </View >
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingHorizontal: 15,
        paddingTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    selectBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#0a84ff',
    },
    selectBtnActive: {
        backgroundColor: '#0a84ff',
    },
    selectBtnText: {
        color: '#0a84ff',
        fontWeight: '600',
        fontSize: 14,
    },
    selectBtnTextActive: {
        color: '#fff',
    },
    selectHint: {
        textAlign: 'center',
        color: '#0a84ff',
        fontSize: 13,
        marginBottom: 10,
    },
    grid: {
        paddingBottom: 100,
    },
    photoCard: {
        width: COLUMN_WIDTH,
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
    },
    photoCardSelected: {
        borderWidth: 3,
        borderColor: '#0a84ff',
    },
    image: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    checkBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#0a84ff',
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
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
    emptyState: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#444',
        marginTop: 16,
    },
    emptySubtext: {
        color: '#aaa',
        marginTop: 6,
        fontSize: 13,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
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
});