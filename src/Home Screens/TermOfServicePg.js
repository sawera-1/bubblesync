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
  SecondaryAccent: '#F56F64', // Coral/Red-Orange (for emphasis)
  Background: '#fefefe', // Light background
  MainText: '#1E252D',
  SubtleText: '#666666',
  White: '#FFFFFF',
  Border: '#e0e0e0',
};

// --- Main Terms of Service Content (Placeholder) ---
const TOS_CONTENT = [
  {
    title: '1. Acceptance of Terms',
    text: 'By creating an account and using the "Bubble Focus" application, you **agree to be bound** by these Terms of Service (ToS), our Privacy Policy, and all other operating rules, policies, and procedures that may be published from time to time on the App.',
  },
  {
    title: '2. User Eligibility and Accounts',
    text: 'The service is intended solely for users who are **eighteen (18) years of age or older** or of legal age in their jurisdiction. You are responsible for safeguarding the password that you use to access the Service.',
  },
  {
    title: '3. Intellectual Property Rights',
    text: 'The App, including all content, features, and functionality (including but not limited to all information, software, display text, images, video, and audio), are and will remain the exclusive property of Bubble Focus and its licensors. You may not modify, copy, reproduce, or commercially exploit any part of the App without express written permission.',
  },
  {
    title: '4. Acceptable Use',
    text: 'You agree not to use the App to: a) post any **unlawful, hateful, or abusive content**; b) attempt to interfere with the proper working of the App; or c) use the App for any commercial solicitation purposes.',
  },
  {
    title: '5. Termination',
    text: 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you **breach the Terms** of Service.',
    emphasis: true,
  },
  {
    title: '6. Limitation of Liability',
    text: 'In no event shall Bubble Focus, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any **indirect, incidental, special, consequential or punitive damages**, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Service.',
  },
  {
    title: '7. Governing Law',
    text: 'These Terms shall be governed and construed in accordance with the laws of the jurisdiction where Bubble Focus is registered, without regard to its conflict of law provisions.',
  },
];

// --- Sub-Components ---

const TermsItem = ({ item }) => (
  <View style={tosStyles.section}>
    <Text style={tosStyles.title}>{item.title}</Text>
    <Text style={[tosStyles.text, item.emphasis && tosStyles.textEmphasis]}>
      {item.text}
    </Text>
  </View>
);

// --- Terms of Service Screen ---

const TermsOfServiceScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.backButton} /> {/* Placeholder */}
      </View>

      <ScrollView contentContainerStyle={styles.contentView}>
        <Text style={tosStyles.date}>
          Effective Date: December 9, 2025
        </Text>
        
        {TOS_CONTENT.map((item, index) => (
          <TermsItem key={index} item={item} />
        ))}

        <Text style={tosStyles.footer}>
          Please read these terms carefully before using the App. If you do not agree to the Terms, do not use the service.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Screen Styles ---

const tosStyles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: COLORS.SubtleText,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PrimaryAccent,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: COLORS.MainText,
    lineHeight: 22,
  },
  textEmphasis: {
    fontWeight: 'bold',
    color: COLORS.SecondaryAccent,
  },
  footer: {
    fontSize: 14,
    color: COLORS.SubtleText,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
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

export default TermsOfServiceScreen;