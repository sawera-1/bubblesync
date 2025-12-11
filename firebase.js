// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyCMY9lXNE8w-DVPNjivYeyegbtwB_0tNIQ",
  authDomain: "bubblesync-fe0e7.firebaseapp.com",
  projectId: "bubblesync-fe0e7",
  storageBucket: "bubblesync-fe0e7.firebasestorage.app",
  messagingSenderId: "412450765044",
  appId: "1:412450765044:web:c6f265eee23cac027986a1",
  measurementId: "G-1WVHR3YDL9"
};

// Initialize Firebase
try {
  var  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };