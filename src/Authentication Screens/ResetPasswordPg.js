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

const ResetPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Add your password reset API logic here
    console.log('Password reset successful:', newPassword);
    navigation.navigate('Login'); // Navigate to login after reset
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
            <Text style={styles.headerTitle}>Reset Password</Text>
            <Text style={styles.headerSubtitle}>
              Enter your new password below to secure your account.
            </Text>
          </View>

          {/* New Password Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor={COLORS.SubtleText}
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.SubtleText}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={COLORS.SubtleText}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={COLORS.SubtleText}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleReset}
          >
            <Text style={styles.primaryButtonText}>Reset Password</Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.signupLinkContainer}
            onPress={() => navigation.navigate('Login')}
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
  primaryButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },
  signupLinkContainer: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: COLORS.SubtleText },
  linkText: { color: COLORS.PrimaryAccent, fontWeight: 'bold' },
});

export default ResetPasswordScreen;
