import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { StatusBar, ActivityIndicator, View } from 'react-native'; 

// 1. Import AuthProvider and useAuth hook
import { AuthProvider, useAuth } from './src/authcontext/AuthContextPg'; 
import LoginScreen from './src/Authentication Screens/LoginPg';
import SignupScreen from './src/Authentication Screens/SignupPg';
import ForgotPasswordScreen from './src/Authentication Screens/ForgotPasswordPg';
import ResetPasswordScreen from './src/Authentication Screens/ResetPasswordPg';
import HomeScreen from './src/Home Screens/HomePg';
import AddTaskScreen from './src/Home Screens/AddTaskPg';
import EditTaskScreen from './src/Home Screens/EditTaskPg';
import ViewTaskScreen from './src/Home Screens/ViewTaskPg';
import NotesScreen from './src/Home Screens/AddVoiceNotesPg';
import ViewEditNoteScreen from './src/Home Screens/EditNotesPg';
import ViewNoteScreen from './src/Home Screens/ViewNotesPg';
import SettingsScreen from './src/Home Screens/SettingsPg';
import EditProfileScreen from './src/Home Screens/EditProfilePg';
import PrivacyPolicyScreen from './src/Home Screens/PrivacyPolicyPg';
import TermsOfServiceScreen from './src/Home Screens/TermOfServicePg';

// Import all your screens



// Define the consistent background color
const APP_BACKGROUND_COLOR = '#fefefe'; 
const Stack = createNativeStackNavigator();

// --- 2. Define the two Navigation Stacks ---

// Screens for users who are NOT logged in
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Screens for users who ARE logged in
const AppStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ViewTask" component={ViewTaskScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AddNote" component={NotesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ViewEditNote" component={ViewEditNoteScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ViewNote" component={ViewNoteScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ToS" component={TermsOfServiceScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);


// --- 3. Root Component that switches between Stacks ---

function RootNavigator() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    // We haven't finished checking for the token yet
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer style={{ backgroundColor: APP_BACKGROUND_COLOR }}>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}


// --- 4. Main App Component Wrapper ---

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={APP_BACKGROUND_COLOR} />
      {/* Wrap the entire app in the AuthProvider */}
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}