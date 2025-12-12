// SignupScreen.js (WITH DEBUG LOGIC)
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
    Alert, // <-- Used for debugging
    ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import the updated helper function (Ensure the path '../Helper/firebaseHelper' is correct)
import { handleSignUp } from '../Helper/firebaseHelper';

// 🎨 Color Palette
const COLORS = {
    PrimaryAccent: '#48C2B3',
    SecondaryAccent: '#F56F64',
    Background: '#fefefe',
    MainText: '#1E252D',
    SubtleText: '#666666',
    White: '#FFFFFF',
};

// Assuming the path is correct
const BUBBLE_LOGO_URI = require('../../images/logo.png');

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

 const handleSignup = async () => {
    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
        Alert.alert('Validation Error', 'All fields are required.');
        return;
    }

    // Name validation
    if (name.trim().length < 3) {
        Alert.alert('Invalid Name', 'Your name must be at least 3 characters.');
        return;
    }

    // Email validation (regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
    }

    // Password strength validation
    if (password.length < 6) {
        Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
        return;
    }

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passRegex.test(password)) {
        Alert.alert(
            'Weak Password',
            'Password must contain at least one letter and one number.'
        );
        return;
    }

    // If validation passed
    setLoading(true);

    try {
        await handleSignUp(email, password, { name });

        Alert.alert(
            'Verify Email',
            `A confirmation link has been sent to ${email}. Please verify your email to continue.`,
            [{ text: 'OK' }]
        );

        navigation.replace('Login');
    } catch (error) {
        let errorMessage = 'Signup failed. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak.';
        } else if (error.message) {
            errorMessage = error.message.replace('Firebase: Error (auth/', '').replace(').', '').replace(/-/g, ' ');
        }

        Alert.alert('Error', errorMessage);
    } finally {
        setLoading(false);
    }
};


    return (
        <SafeAreaView style={styles.safeArea}>
            {/* ... (rest of your component rendering) ... */}
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
                                editable={!loading}
                            />
                            <MaterialCommunityIcons name="account-outline" size={22} color={COLORS.SubtleText} />
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
                                autoCapitalize="none"
                                editable={!loading}
                            />
                            <MaterialCommunityIcons name="email-outline" size={22} color={COLORS.SubtleText} />
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
                                editable={!loading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
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
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.White} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Privacy & Login Link (same as before) */}
                    <Text style={styles.privacyText}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
                        <Text style={styles.linkText}>Terms of Service</Text>.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
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