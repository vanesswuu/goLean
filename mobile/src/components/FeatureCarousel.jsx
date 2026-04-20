import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList } from 'react-native';

// import our data - the features in constants
import welcome_feature from '../constants/features';

// we need the screen width because the carousel needs
//  to know exactly how wide to draw the slides
const { width, height } = Dimensions.get('window');

const FeatureCarousel = () => {

    const flatListRef = useRef(null);

    const currentIndex = useRef(0);

    // Auto-play: scroll to next slide every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            currentIndex.current = (currentIndex.current + 1) % welcome_feature.length;
            flatListRef.current?.scrollToIndex({
                index: currentIndex.current,
                animated: true,
            });
        }, 4000);
        return () => clearInterval(timer);
    }, []);


    return (

        <FlatList
            ref={flatListRef}
            data={welcome_feature}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={[styles.slide, { width }]}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.overlay} />
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.desc}</Text>
                    </View>
                </View>
            )}
            style={{ height: height * 0.60 }}
        />
    );

};


const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute', // Sits behind everything
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)', // 60% darkness over the image
    },
    textContainer: {
        position: 'absolute',
        bottom: 60, // Pushes text near the bottom
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    title: {
        color: '#ffffff',
        fontSize: 36,
        fontWeight: '900', // Extra bold for that premium gym feel
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'uppercase', // FORCES ALL CAPS
        letterSpacing: 2,
    },
    description: {
        color: '#dcdde1',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24, // Gives the text room to breathe
    }
});

export default FeatureCarousel;