import * as React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// 1. Create the Context
const AuthContext = createContext();

// Custom hook for consuming the context
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial check: Load the token from storage when the app starts
    useEffect(() => {
        const bootstrapAsync = async () => {
            let token = null;
            try {
                token = await AsyncStorage.getItem('userToken'); 
            } catch (e) {
                console.error("Error restoring user token:", e);
            }
            setUserToken(token);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);


    // Function to set the token upon successful login/registration
    const signIn = async (token) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            // Setting state triggers the App.js RootNavigator to switch to AppStack
            setUserToken(token); 
        } catch (e) {
            console.error("Error saving user token:", e);
        }
    };

    // Function to clear the token upon sign out
    const signOut = async () => {
        try {
            // Clear persistent storage
            await AsyncStorage.removeItem('userToken'); 
            
            // Setting state triggers the App.js RootNavigator to switch back to AuthStack
            setUserToken(null); 
            
            console.log('User signed out successfully.');
        } catch (e) {
            console.error("Error signing out:", e);
        }
    };

    const contextValue = {
        userToken,
        isLoading,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};