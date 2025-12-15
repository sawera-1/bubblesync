import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Image, Platform, KeyboardAvoidingView,
  Alert, ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { login, auth } from '../Helper/firebaseHelper';
import { useAuth } from '../authcontext/AuthContextPg';
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
class LoginScreen extends Component {
  state = { email: '', password: '', showPassword: false, loading: false, emailError: '', passwordError: '' };

  validateInputs = () => {
    const { email, password } = this.state;
    let valid = true;
    this.setState({ emailError: '', passwordError: '' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) { this.setState({ emailError: 'Enter a valid email address.' }); valid = false; }
    if (!password.trim()) { this.setState({ passwordError: 'Password is required.' }); valid = false; }
    else if (password.length < 6) { this.setState({ passwordError: 'Password must be at least 6 characters.' }); valid = false; }
    return valid;
  };

  handleLogin = async () => {
    if (!this.validateInputs()) return;
    const { email, password } = this.state;
    this.setState({ loading: true });

    try {
      const result = await login(email.trim(), password);
      const user = result.user;
      if (!user.emailVerified) {
        await auth().signOut();
        return Alert.alert('Email Not Verified', 'Please verify your email using the link in Gmail.');
      }
      await this.props.signIn(user.uid);
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Incorrect email or password.');
    } finally {
      this.setState({ loading: false });
    }
  };

  resendVerification = async () => {
    const user = auth().currentUser;
    if (user && !user.emailVerified) {
      try {
        await user.sendEmailVerification();
        Alert.alert('Email Sent', 'Verification email resent. Check your inbox.');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  render() {
    const { email, password, showPassword, loading, emailError, passwordError } = this.state;
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.headerContainer}>
              <Image source={BUBBLE_LOGO_URI} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.headerTitle}>Welcome Back!</Text>
              <Text style={styles.headerSubtitle}>Log in to continue organizing your tasks.</Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input} placeholder="Enter your email"
                  value={email} onChangeText={(text) => this.setState({ email: text, emailError: '' })} editable={!loading}
                  placeholderTextColor={COLORS.SubtleText} keyboardType="email-address" autoCapitalize="none"
                />
                <MaterialCommunityIcons name="email-outline" size={22} color={COLORS.SubtleText} />
              </View>
              {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}

              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input} placeholder="Enter your password"
                  value={password} onChangeText={(text) => this.setState({ password: text, passwordError: '' })} editable={!loading}
                  secureTextEntry={!showPassword} placeholderTextColor={COLORS.SubtleText}
                />
                <TouchableOpacity onPress={() => this.setState({ showPassword: !showPassword })}>
                  <MaterialCommunityIcons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={COLORS.SubtleText} />
                </TouchableOpacity>
              </View>
              {passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}

              <TouchableOpacity onPress={this.resendVerification} style={{ marginTop: 10 }}>
                <Text style={{ color: COLORS.PrimaryAccent }}>Resend Verification Email</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={this.handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color={COLORS.White} /> : <Text style={styles.primaryButtonText}>Log In</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupLinkContainer}>
              <Text style={styles.loginText}>Don't have an account? <Text style={styles.linkText}>Sign Up</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.signupLinkContainer}>
               <Text style={styles.linkText}>Forgot Password</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const LoginScreenWrapper = (props) => {
  const { signIn } = useAuth();
  return <LoginScreen {...props} signIn={signIn} />;
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  container: { padding: 30, paddingBottom: 50, flexGrow: 1 },
  headerContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  logoImage: { width: 100, height: 100 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.MainText },
  headerSubtitle: { fontSize: 16, color: COLORS.SubtleText, marginTop: 5 },
  inputSection: { marginBottom: 30 },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.MainText, marginBottom: 6, marginTop: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.SubtleText, paddingBottom: 8 },
  input: { flex: 1, fontSize: 18, color: COLORS.MainText, paddingRight: 10, paddingVertical: Platform.OS === 'android' ? 10 : 6 },
  errorText: { color: COLORS.SecondaryAccent, fontSize: 12, marginTop: 5 },
  primaryButton: { backgroundColor: COLORS.PrimaryAccent, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 20 },
  primaryButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },
  signupLinkContainer: { marginTop: 20, alignItems: 'center' },
  loginText: { fontSize: 14, color: COLORS.SubtleText },
  linkText: { color: COLORS.PrimaryAccent, fontWeight: 'bold' },
});

export default LoginScreenWrapper;
