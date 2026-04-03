import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAuth } from '../context/AuthContext';



export default function DashboardScreen({ navigation }) {

    const { logout } = useAuth();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>

            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                Hello, you are logged in!
            </Text>

            <TouchableOpacity
                onPress={logout}
                style={{ backgroundColor: '#ff4757', padding: 15, borderRadius: 10 }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>

        </View>
    );
}


