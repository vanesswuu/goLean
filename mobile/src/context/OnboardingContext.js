import React, { createContext, useState, useContext } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    // This state object holds all the user's responses/answers
    const [onboarding, setOnboardingData] = useState({
        name: '',
        goal: '',
        barrier: '',
        activityLevel: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        environment: '',
        timeCommitment: ''
    });

    const updateData = (key, value) => {
        setOnboardingData((prevData) => ({
            ...prevData,
            [key]: value
        }));
    };

    const clearData = () => {
        setOnboardingData({
            name: '',
            goal: '',
            barrier: '',
            activityLevel: '',
            age: '',
            gender: '',
            height: '',
            weight: '',
            environment: '',
            timeCommitment: ''
        });
    };

    return (
        <OnboardingContext.Provider value={{ onboarding, updateData, clearData }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    return useContext(OnboardingContext);
};
