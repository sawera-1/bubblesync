import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 🎨 Color Palette (Consistent with previous screens)
const COLORS = {
  PrimaryAccent: '#48C2B3', // Teal/Aqua Green
  SecondaryAccent: '#F56F64', // Coral/Red-Orange
  Background: '#fefefe', // Light background
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
};

// --- Dummy Data ---
const currentUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  // In a real app, this would be a loaded image URI
  profileIcon: 'account-circle', 
};

// --- Reusable Component for Setting Rows ---
const SettingRow = ({ icon, title, onPress, showArrow = true, isDestructive = false }) => (
  <TouchableOpacity style={settingsStyles.row} onPress={onPress}>
    <View style={settingsStyles.rowLeft}>
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={isDestructive ? COLORS.SecondaryAccent : COLORS.PrimaryAccent} 
      />
      <Text style={[settingsStyles.rowTitle, isDestructive && { color: COLORS.SecondaryAccent }]}>
        {title}
      </Text>
    </View>
    {showArrow && (
      <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.SubtleText} />
    )}
  </TouchableOpacity>
);

// --- Settings Screen ---

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  // Function stubs for navigation/actions
  const navigateTo = (screenName) => console.log('Navigating to:', screenName);
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  const handleSignOut = () => console.log('User signed out.');
  const handleDeleteAccount = () => console.log('Initiating account deletion...');


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.MainText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} /> {/* Placeholder to balance the header */}
      </View>

      <ScrollView contentContainerStyle={styles.contentView}>
        
        {/* 1. Profile/User Section */}
        <View style={settingsStyles.sectionContainer}>
          <View style={settingsStyles.profileCard}>
            <MaterialCommunityIcons 
              name={currentUser.profileIcon} 
              size={60} 
              color={COLORS.PrimaryAccent}
            />
            <View style={settingsStyles.profileInfo}>
              <Text style={settingsStyles.profileName}>{currentUser.name}</Text>
              <Text style={settingsStyles.profileEmail}>{currentUser.email}</Text>
            </View>
            <TouchableOpacity onPress={() => navigateTo('EditProfile')}>
              <MaterialCommunityIcons name="pencil-outline" size={24} color={COLORS.SubtleText} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={settingsStyles.divider} />
        
        <View style={settingsStyles.row}>
          <View style={settingsStyles.rowLeft}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={COLORS.PrimaryAccent} />
            <Text style={settingsStyles.rowTitle}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: COLORS.PrimaryAccent }}
            thumbColor={COLORS.White}
            onValueChange={toggleNotifications}
            value={notificationsEnabled}
          />
        </View>

        <View style={settingsStyles.divider} />

        {/* 3. General & Legal Section */}
        <Text style={settingsStyles.sectionHeader}>Support & Legal</Text>
        <SettingRow 
          icon="file-document-outline" 
          title="Privacy Policy" 
           onPress={() => {
            navigation.navigate('PrivacyPolicy');
          }} 
        />
        <SettingRow 
          icon="book-open-outline" 
          title="Terms of Service" 
           onPress={() => {
            navigation.navigate('ToS');
          }}
        />
        <SettingRow 
          icon="email-outline" 
          title="Contact Us" 
           onPress={() => {
            navigation.navigate('Settings');
          }}
        />

        <View style={settingsStyles.divider} />

        {/* 4. Action Section */}
        <Text style={settingsStyles.sectionHeader}>Actions</Text>
        <SettingRow 
          icon="logout" 
          title="Sign Out" 
          onPress={handleSignOut} 
          showArrow={false}
        />
        <SettingRow 
          icon="delete-outline" 
          title="Delete Account" 
          onPress={handleDeleteAccount} 
          showArrow={false}
          isDestructive={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Screen Styles ---
const settingsStyles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.SubtleText,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.White,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 5,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.MainText,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.SubtleText,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.White,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 16,
    color: COLORS.MainText,
    marginLeft: 15,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.Background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: COLORS.White,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.MainText,
  },
  contentView: {
    paddingBottom: 40,
  },
});

export default SettingsScreen;