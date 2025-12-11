import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 🎨 Color Palette (Consistent)
const COLORS = {
  PrimaryAccent: '#48C2B3', // Teal/Aqua Green
  Background: '#fefefe', // Light background
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
  Border: '#e0e0e0',
};

// --- Main Privacy Policy Content (Placeholder) ---
const POLICY_CONTENT = [
  {
    title: '1. Information We Collect',
    sections: [
      {
        subtitle: 'Personal Information',
        text: 'We collect information you directly provide to us, such as your **name** and **email address** when you create an account. We do not store financial information.',
      },
      {
        subtitle: 'Usage Data',
        text: 'When you use the app, we may automatically collect certain usage information, like device type, operating system version, and how you use the application (e.g., tasks created, notes recorded).',
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    sections: [
      {
        subtitle: 'Service Provision',
        text: 'We use the collected information to **operate, maintain, and improve** the features and functionality of the "Bubble Focus" app, including syncing your tasks and notes.',
      },
      {
        subtitle: 'Communication',
        text: 'We may use your email address to send you service-related notices (e.g., security, account updates) or **marketing communications**, if you opt-in.',
      },
    ],
  },
  {
    title: '3. Data Security and Storage',
    sections: [
      {
        subtitle: 'Security Measures',
        text: 'We implement **industry-standard security measures** designed to protect your information from unauthorized access, loss, or misuse. However, no internet or mobile transmission is 100% secure.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your personal data only for as long as necessary to provide you with the app service or as required by law. If you **delete your account**, your data is permanently removed within 30 days.',
      },
    ],
  },
  {
    title: '4. Your Choices and Rights',
    sections: [
      {
        subtitle: 'Access and Correction',
        text: 'You can review and change your name and profile icon anytime via the **"My Account"** section in Settings.',
      },
      {
        subtitle: 'Opt-out of Communications',
        text: 'You may opt-out of marketing emails by following the unsubscribe instructions provided in those emails.',
      },
    ],
  },
];

// --- Sub-Components ---

const PolicySection = ({ item }) => (
  <View style={policyStyles.majorSection}>
    <Text style={policyStyles.majorTitle}>{item.title}</Text>
    {item.sections.map((section, index) => (
      <View key={index} style={policyStyles.minorSection}>
        <Text style={policyStyles.minorSubtitle}>• {section.subtitle}</Text>
        <Text style={policyStyles.minorText}>{section.text}</Text>
      </View>
    ))}
  </View>
);

// --- Privacy Policy Screen ---

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={28} color={COLORS.MainText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.backButton} /> {/* Placeholder */}
      </View>

      <ScrollView contentContainerStyle={styles.contentView}>
        <Text style={policyStyles.date}>
          Last Updated: December 9, 2025
        </Text>
        
        {POLICY_CONTENT.map((item, index) => (
          <PolicySection key={index} item={item} />
        ))}

        <Text style={policyStyles.footer}>
          Thank you for using BubbleSync. Your privacy is important to us.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Screen Styles ---

const policyStyles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: COLORS.SubtleText,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  majorSection: {
    marginBottom: 25,
  },
  majorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.MainText,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.Border,
    paddingBottom: 5,
  },
  minorSection: {
    marginBottom: 15,
  },
  minorSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PrimaryAccent,
    marginBottom: 5,
  },
  minorText: {
    fontSize: 15,
    color: COLORS.MainText,
    lineHeight: 22,
  },
  footer: {
    fontSize: 14,
    color: COLORS.SubtleText,
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  }
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
    borderBottomColor: COLORS.Border,
    backgroundColor: COLORS.White,
  },
  backButton: {
    padding: 5,
    width: 40, 
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.MainText,
  },
  contentView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 40,
  },
});

export default PrivacyPolicyScreen;