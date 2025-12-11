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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 🎨 Color Palette
const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  Background: '#fefefe',
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
};

// Logo
const BUBBLE_LOGO_URI = require('../../images/logo.png');

const SignupScreen = ({ navigation }) => {  // <-- Get navigation prop
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Handle signup logic here
    console.log({ name, email, password });
    // Optionally navigate to another screen after signup
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

            <Text style={styles.headerTitle}>Join the Bubble!</Text>
            <Text style={styles.headerSubtitle}>Organize Life, One Task At a Time</Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputSection}>

            {/* Name */}
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.SubtleText}
                value={name}
                onChangeText={setName}
              />
              <MaterialCommunityIcons
                name="account-outline"
                size={22}
                color={COLORS.SubtleText}
              />
            </View>

            {/* Email */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.SubtleText}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <MaterialCommunityIcons
                name="email-outline"
                size={22}
                color={COLORS.SubtleText}
              />
            </View>

            {/* Password */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Create a strong password"
                placeholderTextColor={COLORS.SubtleText}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.SubtleText}
                />
              </TouchableOpacity>
            </View>

          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSignup}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Privacy */}
          <Text style={styles.privacyText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
            <Text style={styles.linkText}>Terms of Service</Text>.
          </Text>

          {/* Login Link */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')} // <-- Navigate to Login screen
            style={styles.loginLinkContainer}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.linkText}>Log In</Text>
            </Text>
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
  logoPlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  logoImage: { width: 100, height: 100 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.MainText },
  headerSubtitle: { fontSize: 16, color: COLORS.SubtleText, marginTop: 5 },
  inputSection: { marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.MainText, marginBottom: 6, marginTop: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.SubtleText, paddingBottom: 8 },
  input: { flex: 1, fontSize: 18, color: COLORS.MainText, paddingRight: 10, paddingVertical: Platform.OS === 'android' ? 10 : 6 },
  primaryButton: { backgroundColor: COLORS.PrimaryAccent, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 20, elevation: 8 },
  primaryButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },
  privacyText: { fontSize: 12, color: COLORS.SubtleText, textAlign: 'center', marginTop: 20, lineHeight: 18 },
  loginLinkContainer: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: COLORS.SubtleText },
  linkText: { color: COLORS.PrimaryAccent, fontWeight: 'bold' },
});

export default SignupScreen;
