import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../authcontext/AuthContextPg';

// -----------------------------------------------------------------------------
// CONSTANTS
// -----------------------------------------------------------------------------

const DEFAULT_AVATAR_LOGO = require('../../images/logo.png');

const COLORS = {
  PrimaryAccent: '#48C2B3',
  SecondaryAccent: '#F56F64',
  Background: '#FEFEFE',
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
  Danger: '#F56F64',
};

// -----------------------------------------------------------------------------
// SMALL COMPONENTS
// -----------------------------------------------------------------------------

const ProfileAvatar = ({ photoURL }) => {
  return (
    <Image
      source={photoURL ? { uri: photoURL } : DEFAULT_AVATAR_LOGO}
      style={[
        settingsStyles.profileImage,
        !photoURL && { tintColor: COLORS.PrimaryAccent, resizeMode: 'contain' },
      ]}
    />
  );
};

const SettingRow = ({ icon, title, onPress, showArrow = true, danger = false }) => {
  return (
    <TouchableOpacity style={settingsStyles.row} onPress={onPress}>
      <View style={settingsStyles.rowLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={danger ? COLORS.SecondaryAccent : COLORS.PrimaryAccent}
        />
        <Text
          style={[settingsStyles.rowTitle, danger && { color: COLORS.SecondaryAccent }]}
        >
          {String(title)}
        </Text>
      </View>

      {showArrow && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={COLORS.SubtleText}
        />
      )}
    </TouchableOpacity>
  );
};

// -----------------------------------------------------------------------------
// MAIN SCREEN
// -----------------------------------------------------------------------------

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Loading...',
    email: 'Loading...',
    photoURL: null,
  });

  useEffect(() => {
    const user = auth().currentUser;

    if (!user) {
      setUserData({ name: 'Guest', email: 'N/A', photoURL: null });
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(
        snap => {
          const data = snap.exists ? snap.data() : {};
          setUserData({
            name: data?.name || user.displayName || 'New User',
            email: data?.email || user.email || 'N/A',
            photoURL: data?.photoURL || null,
          });
          setLoading(false);
        },
        () => setLoading(false),
      );

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    setShowSignOutModal(false);
    await signOut();
  };



const handleDeleteAccount = async () => {
  try {
    setDeleting(true);

    const user = auth().currentUser;
    if (!user) return;

    const uid = user.uid;

    // 1️⃣ Delete Firestore data
    await firestore().collection('users').doc(uid).delete();

    // 2️⃣ Delete Firebase Auth user
    await user.delete();

    // 3️⃣ CLEAR TOKEN → switches stack automatically
    await signOut();

  } catch (error) {
    console.log('Delete account error:', error);

    if (error.code === 'auth/requires-recent-login') {
      alert('Please log in again to delete your account.');
    } else {
      alert('Failed to delete account.');
    }
  } finally {
    setDeleting(false);
    setShowDeleteModal(false);
  }
};



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PrimaryAccent} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.androidPadding} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={settingsStyles.profileCard}>
          <ProfileAvatar photoURL={userData.photoURL} />

          <View style={settingsStyles.profileInfo}>
            <Text style={settingsStyles.profileName}>{String(userData.name)}</Text>
            <Text style={settingsStyles.profileEmail}>{String(userData.email)}</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <MaterialCommunityIcons name="pencil-outline" size={22} />
          </TouchableOpacity>
        </View>

       

       

        <View style={settingsStyles.divider} />

        {/* Support */}
        <Text style={settingsStyles.sectionHeader}>Support & Legal</Text>
        <SettingRow
  icon="file-document-outline"
  title="Privacy Policy"
  onPress={() => navigation.navigate('WebViewScreen', {
    title: 'Privacy Policy',
    url: 'https://sites.google.com/view/bubblesync-privacypolicy/home'
  })}
/>

<SettingRow
  icon="book-open-outline"
  title="Terms of Service"
  onPress={() => navigation.navigate('WebViewScreen', {
    title: 'Terms of Service',
    url: 'https://sites.google.com/view/bubblesync-termsofservices/home'
  })}
/>

        <SettingRow icon="email-outline" title="Contact Us" onPress={() => navigation.navigate('ContactUs')} />

        <View style={settingsStyles.divider} />

        {/* Actions */}
        <Text style={settingsStyles.sectionHeader}>Actions</Text>
        <SettingRow icon="logout" title="Sign Out" showArrow={false} onPress={() => setShowSignOutModal(true)} />
        <SettingRow icon="delete-outline" title="Delete Account" danger showArrow={false} onPress={() => setShowDeleteModal(true)} />
      </ScrollView>

      {/* Sign Out Modal */}
      <Modal transparent animationType="fade" visible={showSignOutModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>Sign Out</Text>
            <Text style={modalStyles.text}>Are you sure you want to sign out?</Text>

            <View style={modalStyles.row}>
              <TouchableOpacity style={modalStyles.cancelBtn} onPress={() => setShowSignOutModal(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.signOutBtn} onPress={handleSignOut}>
                <Text style={{ color: '#fff' }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal transparent animationType="fade" visible={showDeleteModal}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>Delete Account</Text>
            <Text style={modalStyles.text}>
              This action is permanent. Your account and all data will be deleted.
            </Text>

            <View style={modalStyles.row}>
              <TouchableOpacity style={modalStyles.cancelBtn} onPress={() => setShowDeleteModal(false)} disabled={deleting}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.signOutBtn} onPress={handleDeleteAccount} disabled={deleting}>
                <Text style={{ color: '#fff' }}>{deleting ? 'Deleting...' : 'Delete'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.Background },
  androidPadding: { height: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: COLORS.White,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10 },
});

const settingsStyles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.White,
    margin: 10,
    borderRadius: 12,
  },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  profileInfo: { flex: 1, marginLeft: 15 },
  profileName: { fontSize: 18, fontWeight: 'bold' },
  profileEmail: { color: COLORS.SubtleText },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  sectionHeader: { marginLeft: 15, marginBottom: 5, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.White,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { marginLeft: 15, fontSize: 16 },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  text: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 12 },
  signOutBtn: { padding: 12, backgroundColor: COLORS.Danger, borderRadius: 8 },
});

export default SettingsScreen;
