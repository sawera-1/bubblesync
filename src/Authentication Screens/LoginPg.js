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

const LoginScreen = ({ navigation }) => { // <-- Get navigation prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Add your login logic here
    console.log({ email, password });
    // Example: navigation.navigate('Home'); after successful login
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>
              Log in to continue organizing your tasks.
            </Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputSection}>
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
                placeholder="Enter your password"
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

            {/* Forgot Password */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ForgotPassword')} // Example navigation
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Log In Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            //onPress={handleLogin}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Privacy */}
          <Text style={styles.privacyText}>
            By logging in, you agree to our{' '}
            <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
            <Text style={styles.linkText}>Terms of Service</Text>.
          </Text>

          {/* Sign Up Link */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Signup')} // Navigate to Signup
            style={styles.signupLinkContainer}
          >
            <Text style={styles.loginText}>
              Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
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
  headerContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  logoPlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  logoImage: { width: 100, height: 100 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.MainText },
  headerSubtitle: { fontSize: 16, color: COLORS.SubtleText, marginTop: 5 },
  inputSection: { marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.MainText, marginBottom: 6, marginTop: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.SubtleText, paddingBottom: 8 },
  input: { flex: 1, fontSize: 18, color: COLORS.MainText, paddingRight: 10, paddingVertical: Platform.OS === 'android' ? 10 : 6 },
  forgotPasswordContainer: { alignItems: 'flex-end', marginTop: 10 },
  forgotPasswordText: { fontSize: 14, color: COLORS.SubtleText, fontWeight: '600' },
  primaryButton: { backgroundColor: COLORS.PrimaryAccent, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 20, elevation: 8 },
  primaryButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },
  privacyText: { fontSize: 12, color: COLORS.SubtleText, textAlign: 'center', marginTop: 20, lineHeight: 18 },
  signupLinkContainer: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: COLORS.SubtleText },
  linkText: { color: COLORS.PrimaryAccent, fontWeight: 'bold' },
});

export default LoginScreen;
