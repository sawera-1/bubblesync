// SignupScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Image, Platform, KeyboardAvoidingView,
  Alert, ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { handleSignUp } from '../Helper/firebaseHelper'; 
// 🎨 Color Palette (From your provided styles)
const COLORS = {
    PrimaryAccent: '#48C2B3',
    SecondaryAccent: '#F56F64',
    Background: '#fefefe',
    MainText: '#1E252D',
    SubtleText: '#666666',
    White: '#FFFFFF',
};

// Assuming this path is correct
const BUBBLE_LOGO_URI = require('../../images/logo.png');

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert('Validation Error', 'All fields are required.');
    }
    if (name.trim().length < 3) return Alert.alert('Invalid Name', 'Name must be at least 3 characters.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return Alert.alert('Invalid Email', 'Enter a valid email address.');
    if (password.length < 6 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      return Alert.alert('Weak Password', 'Password must be at least 6 characters and contain a letter and a number.');
    }

    setLoading(true);
    try {
      await handleSignUp(email.trim(), password, { name: name.trim() });
      Alert.alert(
        'Verify Email',
        `A verification link has been sent to ${email}. Please verify your email to log in.`,
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );
    } catch (error) {
      let msg = error.code === 'auth/email-already-in-use'
        ? 'This email is already registered.'
        : error.message;
      Alert.alert('Signup Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.headerContainer}>
            <Image source={BUBBLE_LOGO_URI} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.headerTitle}>Join the Bubble!</Text>
            <Text style={styles.headerSubtitle}>Organize Life, One Task At a Time</Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input} placeholder="Enter your name"
                value={name} onChangeText={setName} editable={!loading}
                placeholderTextColor={COLORS.SubtleText}
              />
              <MaterialCommunityIcons name="account-outline" size={22} color={COLORS.SubtleText} />
            </View>

            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input} placeholder="Enter your email"
                value={email} onChangeText={setEmail} editable={!loading}
                placeholderTextColor={COLORS.SubtleText} keyboardType="email-address" autoCapitalize="none"
              />
              <MaterialCommunityIcons name="email-outline" size={22} color={COLORS.SubtleText} />
            </View>

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input} placeholder="Create a password"
                value={password} onChangeText={setPassword} editable={!loading}
                secureTextEntry={!showPassword} placeholderTextColor={COLORS.SubtleText}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={COLORS.SubtleText} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.White} /> : <Text style={styles.primaryButtonText}>Create Account</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? <Text style={styles.linkText}>Log In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  container: { padding: 30, paddingBottom: 50, flexGrow: 1 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoImage: { width: 100, height: 100 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.MainText },
  headerSubtitle: { fontSize: 16, color: COLORS.SubtleText, marginTop: 5 },
  inputSection: { marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.MainText, marginBottom: 6, marginTop: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.SubtleText, paddingBottom: 8 },
  input: { flex: 1, fontSize: 18, color: COLORS.MainText, paddingRight: 10, paddingVertical: Platform.OS === 'android' ? 10 : 6 },
  primaryButton: { backgroundColor: COLORS.PrimaryAccent, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 20 },
  primaryButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },
  loginLinkContainer: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: COLORS.SubtleText },
  linkText: { color: COLORS.PrimaryAccent, fontWeight: 'bold' },
});

export default SignupScreen;
