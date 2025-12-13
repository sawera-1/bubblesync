import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const COLORS = {
  PrimaryAccent: '#48C2B3',
  Background: '#fefefe',
  MainText: '#1E252D',
  SubtleText: '#999999',
  White: '#FFFFFF',
  InputBg: '#FFFFFF',
};

const EditProfileScreen = ({ navigation }) => {
  const user = auth().currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [originalName, setOriginalName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [firestoreName, setFirestoreName] = useState(null);

  useEffect(() => {
    if (!user) {
      Alert.alert("Error", "User not logged in.");
      navigation.goBack();
      return;
    }

    const fetchFirestoreName = async () => {
      try {
        const doc = await firestore().collection('users').doc(user.uid).get();
        if (doc.exists) {
          const data = doc.data();
          const fetchedName = data.name || user.displayName || '';
          setFirestoreName(fetchedName);
          setDisplayName(fetchedName);
          setOriginalName(fetchedName);
        }
      } catch (error) {
        console.error("Failed to fetch Firestore name:", error);
      }
    };
    fetchFirestoreName();
  }, [user, navigation]);

  const handleSaveProfile = async () => {
    if (!displayName.trim() || displayName.trim() === originalName) {
      Alert.alert('No Change', 'Please enter a new name to save.');
      return;
    }

    setSaving(true);
    const newName = displayName.trim();

    try {
      await user.updateProfile({ displayName: newName });
      await firestore().collection('users').doc(user.uid).set({ name: newName }, { merge: true });
      Alert.alert('Success', 'Profile updated successfully!');
      setOriginalName(newName);
      navigation.goBack();
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', `Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const isSaveDisabled = saving || !displayName.trim() || displayName.trim() === originalName;

  return (
    <SafeAreaView style={editStyles.safeArea}>
      {/* Android Status Bar Padding */}
      {Platform.OS === 'android' && <View style={editStyles.androidStatusPadding} />}

      <ScrollView contentContainerStyle={editStyles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={editStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={editStyles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.MainText} />
          </TouchableOpacity>
          <Text style={editStyles.headerTitle}>Edit Profile</Text>
          <View style={editStyles.backButton} />
        </View>

        {/* Profile Picture Placeholder */}
        <View style={editStyles.avatarContainer} />

        {/* Display Name Input */}
        <View style={editStyles.card}>
          <Text style={editStyles.label}>Display Name</Text>
          <TextInput
            style={editStyles.input}
            placeholder="Enter your new name"
            placeholderTextColor={COLORS.SubtleText}
            value={displayName}
            onChangeText={setDisplayName}
            editable={!saving}
          />
        </View>

        {/* Email Display */}
        <View style={editStyles.card}>
          <Text style={editStyles.label}>Email Address</Text>
          <View style={editStyles.readOnlyInput}>
            <Text style={editStyles.readOnlyText}>{user?.email || 'N/A'}</Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[editStyles.saveButton, isSaveDisabled && editStyles.saveButtonDisabled]}
          onPress={handleSaveProfile}
          disabled={isSaveDisabled}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.White} />
          ) : (
            <Text style={editStyles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={editStyles.forgotPasswordLink}
          onPress={() => navigation.navigate('ForgotPassword')}
          disabled={saving}
        >
          <Text style={editStyles.forgotPasswordText}>Change Password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const editStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  androidStatusPadding: { height: StatusBar.currentHeight || 0 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: COLORS.White,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 5, width: 40, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.MainText, flex: 1, textAlign: 'center' },

  container: { padding: 20, paddingBottom: 50 },

  avatarContainer: { alignItems: 'center', marginBottom: 30, marginTop: 10 },

  card: {
    backgroundColor: COLORS.White,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.MainText, marginBottom: 8 },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.MainText,
  },
  readOnlyInput: { backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12 },
  readOnlyText: { fontSize: 16, color: COLORS.SubtleText },

  saveButton: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.PrimaryAccent,
    elevation: 4,
  },
  saveButtonDisabled: { backgroundColor: '#999' },
  saveButtonText: { color: COLORS.White, fontSize: 18, fontWeight: 'bold' },

  forgotPasswordLink: { marginTop: 20, alignSelf: 'center', padding: 10 },
  forgotPasswordText: { color: COLORS.PrimaryAccent, fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
});

export default EditProfileScreen;
