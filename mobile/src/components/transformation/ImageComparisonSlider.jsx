import React, { useState } from 'react';
import {
    View, Image, Animated, PanResponder, Dimensions, StyleSheet
} from 'react-native';

export default function ImageComparisonSlider({ beforeUri, afterUri }) {

    const screenWidth = Dimensions.get('window').width;
    const [sliderPos, setSliderPos] = useState(screenWidth / 2);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {

            const pos = Math.max(0, Math.min(screenWidth, gestureState.moveX));
            setSliderPos(pos);

        },
        onPanResponderRelease: () => { },
    });

    return (
        <View style={styles.container}>
            {/* background – “after” image */}
            <Image source={{ uri: afterUri }} style={styles.fullImage} />

            {/* Foreground – “before” image, width follows the slider */}
            <Animated.View style={[styles.overlay, { width: sliderPos }]}>
                <Image source={{ uri: beforeUri }} style={styles.fullImage} />
            </Animated.View>

            {/* Slider handle */}
            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.handle,
                    { left: sliderPos - HANDLE_SIZE / 2 },
                ]}
            >
                <View style={styles.handleBar} />
            </Animated.View>

        </View>
    );

}

const HANDLE_SIZE = 30;
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 300,
        overflow: 'hidden',
        marginBottom: 20,
    },
    fullImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
    },
    overlay: {
        overflow: 'hidden',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    handle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: HANDLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: HANDLE_SIZE / 2,
    },
    handleBar: {
        width: 2,
        height: '100%',
        backgroundColor: '#000',
    },
});