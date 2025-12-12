// LoginScreen.js (CLASS-BASED, VALIDATION ADDED)

import React, { Component } from 'react';
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
    ActivityIndicator
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { login } from '../Helper/firebaseHelper';

const COLORS = {
    PrimaryAccent: '#48C2B3',
    SecondaryAccent: '#F56F64',
    Background: '#fefefe',
    MainText: '#1E252D',
    SubtleText: '#666666',
    White: '#FFFFFF',
};

const BUBBLE_LOGO_URI = require('../../images/logo.png');

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showPassword: false,
            loading: false,

            // Validation errors
            emailError: '',
            passwordError: '',
        };
    }

    validateInputs = () => {
        const { email, password } = this.state;
        let valid = true;

        // Reset errors
        this.setState({ emailError: '', passwordError: '' });

        // Validate email
        if (!email.trim()) {
            this.setState({ emailError: 'Email is required.' });
            valid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                this.setState({ emailError: 'Enter a valid email address.' });
                valid = false;
            }
        }

        // Validate password
        if (!password.trim()) {
            this.setState({ passwordError: 'Password is required.' });
            valid = false;
        } else if (password.length < 6) {
            this.setState({ passwordError: 'Password must be at least 6 characters.' });
            valid = false;
        }

        return valid;
    };

    handleLogin = async () => {
        if (!this.validateInputs()) return;

        const { email, password } = this.state;
        const { navigation } = this.props;

        this.setState({ loading: true });

        try {
            await login(email.trim(), password);
            navigation.replace('Home');

        } catch (error) {
            console.error("Login Error:", error);

            let errorMessage = 'Login failed. Please check your credentials.';

            if (error.code) {
                if (error.code === 'auth/invalid-email') {
                    errorMessage = 'The email address format is invalid.';
                } else if (
                    error.code === 'auth/user-not-found' ||
                    error.code === 'auth/wrong-password'
                ) {
                    errorMessage = 'Incorrect email or password.';
                } else {
                    errorMessage = error.message
                        .replace('Firebase: Error (auth/', '')
                        .replace(').', '')
                        .replace(/-/g, ' ');
                }
            }

            Alert.alert('Login Failed', errorMessage);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const {
            email,
            password,
            showPassword,
            loading,
            emailError,
            passwordError
        } = this.state;

        const { navigation } = this.props;

        return (
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                    >

                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <View style={styles.logoPlaceholder}>
                                <Image
                                    source={BUBBLE_LOGO_URI}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.headerTitle}>Welcome Back!</Text>
                            <Text style={styles.headerSubtitle}>
                                Log in to continue organizing your tasks.
                            </Text>
                        </View>

                        {/* Input Section */}
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
                                    editable={!loading}
                                    onChangeText={(text) =>
                                        this.setState({ email: text, emailError: '' })
                                    }
                                />
                                <MaterialCommunityIcons
                                    name="email-outline"
                                    size={22}
                                    color={COLORS.SubtleText}
                                />
                            </View>
                            {emailError !== '' && (
                                <Text style={styles.errorText}>{emailError}</Text>
                            )}

                            {/* Password */}
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.SubtleText}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    editable={!loading}
                                    onChangeText={(text) =>
                                        this.setState({ password: text, passwordError: '' })
                                    }
                                />

                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({ showPassword: !showPassword })
                                    }
                                    disabled={loading}
                                >
                                    <MaterialCommunityIcons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color={COLORS.SubtleText}
                                    />
                                </TouchableOpacity>
                            </View>
                            {passwordError !== '' && (
                                <Text style={styles.errorText}>{passwordError}</Text>
                            )}

                            <TouchableOpacity
                                onPress={() => navigation.navigate('ForgotPassword')}
                                style={styles.forgotPasswordContainer}
                            >
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={this.handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.White} />
                            ) : (
                                <Text style={styles.primaryButtonText}>Log In</Text>
                            )}
                        </TouchableOpacity>

                        {/* Privacy */}
                        <Text style={styles.privacyText}>
                            By logging in, you agree to our{' '}
                            <Text style={styles.linkText}>Privacy Policy</Text> and{' '}
                            <Text style={styles.linkText}>Terms of Service</Text>.
                        </Text>

                        {/* Sign Up */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Signup')}
                            style={styles.signupLinkContainer}
                        >
                            <Text style={styles.loginText}>
                                Don't have an account?{' '}
                                <Text style={styles.linkText}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.Background },
    container: { padding: 30, paddingBottom: 50, flexGrow: 1 },
    headerContainer: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
    logoPlaceholder: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center' },
    logoImage: { width: 100, height: 100 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.MainText },
    headerSubtitle: { fontSize: 16, color: COLORS.SubtleText, marginTop: 5 },

    inputSection: { marginBottom: 30 },
    inputLabel: { fontSize: 14, fontWeight: 'bold', color: COLORS.MainText, marginBottom: 6, marginTop: 15 },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.SubtleText,
        paddingBottom: 8
    },

    input: {
        flex: 1,
        fontSize: 18,
        color: COLORS.MainText,
        paddingRight: 10,
        paddingVertical: Platform.OS === 'android' ? 10 : 6
    },

    errorText: {
        color: COLORS.SecondaryAccent,
        fontSize: 12,
        marginTop: 5,
    },

    forgotPasswordContainer: { alignItems: 'flex-end', marginTop: 10 },
    forgotPasswordText: { fontSize: 14, color: COLORS.SubtleText, fontWeight: '600' },

    primaryButton: {
        backgroundColor: COLORS.PrimaryAccent,
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20
    },

    primaryButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },

    privacyText: { fontSize: 12, color: COLORS.SubtleText, textAlign: 'center', marginTop: 20, lineHeight: 18 },
    signupLinkContainer: { marginTop: 20, alignItems: 'center' },
    loginText: { fontSize: 14, color: COLORS.SubtleText },
    linkText: { color: COLORS.PrimaryAccent, fontWeight: 'bold' },
});

export default LoginScreen;
