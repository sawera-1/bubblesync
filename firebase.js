// firebase.js (FINALIZED: React Native Firebase SDK)

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// No need for initializeApp or web SDK config here.
// React Native Firebase auto-initializes using google-services.json (Android)
// and GoogleService-Info.plist (iOS).

export { auth, firestore};