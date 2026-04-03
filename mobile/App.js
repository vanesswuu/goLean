import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

import { OnboardingProvider } from './src//context/OnboardingContext';
import { AuthProvider } from './src/context/AuthContext';


export default function App() {

    return (

        <AuthProvider>
            <OnboardingProvider>
                <AppNavigator />
            </OnboardingProvider>
        </AuthProvider>


    )


}