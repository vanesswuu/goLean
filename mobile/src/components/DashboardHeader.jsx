import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

export default function DashboardHeader() {

    const navigation = useNavigation();

    const [menuVisible, setMenuVisible] = useState(false);

    return (

        <View style={styles.header}>

            <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate('Profile')}>

                <Ionicons name='person' size={24} color='#57606f' />

            </TouchableOpacity>


            <TouchableOpacity>

                <Ionicons name='notifications-outline' size={28} color='#2f3542' />

            </TouchableOpacity>

        </View>





    );

}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 50, // Standard padding to clear the notch
        backgroundColor: '#fff',
    },
    profileCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#f1f2f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ced6e0'
    }
});