import 'react-native-gesture-handler';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

import { OnboardingProvider } from './context/OnboardingContext';

export default function App() {

    return (
        <OnboardingProvider>
            <AppNavigator />
        </OnboardingProvider>

    )


}