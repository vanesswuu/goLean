import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

// import our data - the features in constants
import welcome_feature from '../constants/features';

// we need the screen width because the carousel needs
//  to know exactly how wide to draw the slides
const { width, height } = Dimensions.get('window');

const FeatureCarousel = () => {

    return (
        <Carousel
            loop={true}           // Keep swiping forever
            width={width}         // Full screen width
            height={height * 0.60}  // Almost full screen height
            autoPlay={true}       // Moves automatically
            autoPlayInterval={3000} // Waits 3 seconds per slide
            scrollAnimationDuration={1000} // Takes 1 second to slide
            data={welcome_feature}
            renderItem={({ item }) => ( //this loops through the data
                <View style={styles.slide}>
                    {/* The Background Image */}
                    <Image source={{ uri: item.image }} style={styles.image} />

                    {/* The Dark Overlay (So white text is readable) */}
                    <View style={styles.overlay} />

                    {/* The Typography */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.desc}</Text>
                    </View>
                </View>
            )}
        />



    )
    //end of feature carousel component
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