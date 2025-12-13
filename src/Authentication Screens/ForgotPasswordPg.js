import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// =======================================================
// 🔥 START: UPDATED FIREBASE IMPORTS
// We now import the helper function using the Native SDK logic.
// Please verify this path matches the location of your firebaseHelper.js!
// =======================================================
import { forgotPassword } from '../Helper/firebaseHelper'; // <-- CHECK THIS PATH!
// =======================================================
// 🔥 END: UPDATED FIREBASE IMPORTS
// =======================================================


// 🎨 Color Palette (remains the same)
const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  Background: '#fefefe',
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
};

// Logo (remains the same)
const BUBBLE_LOGO_URI = require('../../images/logo.png'); 

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    // 1. Basic Input Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);

    // =======================================================
    // 🔥 CALLING THE NATIVE FIREBASE HELPER FUNCTION NOW
    // =======================================================
    forgotPassword(email.trim())
      .then(() => {
        // Success Handler: Show alert and navigate back to Login
        setIsLoading(false);
        Alert.alert(
          'Success',
          `A password reset link has been sent to ${email}. Please check your inbox (and spam folder!).`,
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      })
      .catch((error) => {
        // Error Handler: Log error and show specific alert
        setIsLoading(false);
        // The helper throws the native Firebase error object
        console.error('Password Reset Error:', error.code, error.message);

        // Customize the error message based on common Firebase codes
        let userMessage = 'Failed to send reset link. Please try again.';
        if (error.code === 'auth/user-not-found') {
          userMessage = 'The email address is not registered.';
        } else if (error.code === 'auth/invalid-email') {
          userMessage = 'The email address format is invalid.';
        } else if (error.code === 'auth/too-many-requests') {
          userMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        } else if (error.message) {
            // Catch-all for non-standard error messages
            userMessage = error.message; 
        }

        Alert.alert('Error', userMessage);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
              <Image source={BUBBLE_LOGO_URI} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.headerTitle}>Forgot Password?</Text>
            <Text style={styles.headerSubtitle}>
              Enter your email address below to receive a password reset link.
            </Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.SubtleText}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading} // Disable input while loading
              />
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color={COLORS.SubtleText}
              />
            </View>
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.signupLinkContainer}
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={styles.loginText}>
              Back to <Text style={styles.linkText}>Log In</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    // ... (styles remain the same)
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  container: { padding: 30, paddingBottom: 50, flexGrow: 1 },
  headerContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  logoPlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  logoImage: { width: 100, height: 100 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.MainText },
  headerSubtitle: { fontSize: 16, color: COLORS.SubtleText, marginTop: 5, textAlign: 'center' },
  inputSection: { marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.MainText, marginBottom: 6, marginTop: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.SubtleText, paddingBottom: 8 },
  input: { flex: 1, fontSize: 18, color: COLORS.MainText, paddingRight: 10, paddingVertical: Platform.OS === 'android' ? 10 : 6 },
  primaryButton: { backgroundColor: COLORS.PrimaryAccent, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 20, elevation: 8 },
  disabledButton: { opacity: 0.7 }, // Style for disabled button
  primaryButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },
  signupLinkContainer: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: COLORS.SubtleText },
  linkText: { color: COLORS.PrimaryAccent, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;