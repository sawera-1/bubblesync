import * as React from 'react';
// 💡 IMPORT STATUSBAR COMPONENT
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { StatusBar } from 'react-native'; // <-- Imported here
import SignupScreen from './src/Authentication Screens/SignupPg';
import LoginScreen from './src/Authentication Screens/LoginPg';
import ForgotPasswordScreen from './src/Authentication Screens/ForgotPasswordPg';
import ResetPasswordScreen from './src/Authentication Screens/ResetPasswordPg';
import HomeScreen from './src/Home Screens/HomePg';
import AddTaskScreen from './src/Home Screens/AddTaskPg';
import VoiceNoteScreen from './src/Home Screens/AddVoiceNotesPg';
import SettingsScreen from './src/Home Screens/SettingsPg';
import PrivacyPolicyScreen from './src/Home Screens/PrivacyPolicyPg';
import TermsOfServiceScreen from './src/Home Screens/TermOfServicePg';
import EditTaskScreen from './src/Home Screens/EditTaskPg';
import ViewTaskScreen from './src/Home Screens/ViewTaskPg';
import ViewEditNoteScreen from './src/Home Screens/EditNotesPg';
import ViewNoteScreen from './src/Home Screens/ViewNotesPg';



// Define the consistent background color used across your app
const APP_BACKGROUND_COLOR = '#fefefe'; 

// Create Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      {/* 💡 FIX: Set the Status Bar text/icons to dark-content. 
          This ensures they are visible against the white background. */}
      <StatusBar barStyle="dark-content" backgroundColor={APP_BACKGROUND_COLOR} />
      
      <NavigationContainer style={{ backgroundColor: APP_BACKGROUND_COLOR }}>
        <Stack.Navigator initialRouteName="Signup">
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="EditTask"
            component={EditTaskScreen}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="ViewTask"
            component={ViewTaskScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddNote"
            component={VoiceNoteScreen}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="ViewEditNote"
            component={ViewEditNoteScreen}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="ViewNote"
            component={ViewNoteScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ToS"
            component={TermsOfServiceScreen}
            options={{ headerShown: false }}
          />
          {/* Add other screens here if needed */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}