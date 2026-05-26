import React, { useState } from 'react';
import {
    View, Image, Animated, PanResponder, Dimensions, StyleSheet, Modal, TouchableOpacity,
    Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const { width: SW, height: SH } = Dimensions.get('window');

export default function
    ImageComparisonSlider({ beforeUri, afterUri, onClose }) {

    const [sliderPos, setSliderPos] = useState(SW / 2);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, g) => {
            setSliderPos(Math.max(0, Math.min(SW, g.moveX)));
        },
        onPanResponderRelease: () => { },
    });

    return (
        <Modal visible animationType='slide' statusBarTranslucent>
            <View style={styles.container}>

                {/* after image */}
                <Image source={{ uri: afterUri }} style={styles.fullImage} />
                {/*before image */}
                <View style={[styles.clip, { width: sliderPos }]}>
                    <Image source={{ uri: beforeUri }} style={[styles.fullImage, { width: SW }]} />
                </View>

                {/* labels */}
                <View style={[styles.label, { left: 12 }]}>
                    <Text style={styles.labelText}>BEFORE</Text>
                </View>
                <View style={[styles.label, { right: 12 }]}>
                    <Text style={styles.labelText}>AFTER</Text>
                </View>

                {/* slider handle */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[styles.handle, { left: sliderPos - 22 }]}
                >
                    <View style={styles.line} />
                    <View style={styles.knob}>
                        <Ionicons name="chevron-back" size={14} color="#fff" />
                        <Ionicons name="chevron-forward" size={14} color="#fff" />
                    </View>
                    <View style={styles.line} />
                </Animated.View>

                {/* close button */}
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Ionicons name="close" size={22} color="#fff" />
                </TouchableOpacity>

            </View>
        </Modal>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        width: SW,
        height: SH,
    },
    fullImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SW,
        height: SH,
        resizeMode: 'cover',
    },
    clip: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: SH,
        overflow: 'hidden',
    },
    handle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: '#fff',
    },
    knob: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#fff',
    },
    label: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    labelText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 1,
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
});