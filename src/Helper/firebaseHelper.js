// firebaseHelper.js (CORRECTED for @react-native-firebase)

// 🚨 UPDATED IMPORTS 🚨
// We now import the module instances, not individual functions
import { auth, firestore } from '../../firebase'; // Changed 'db' to 'firestore' for clarity
import { doc, setDoc, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; // Note: You still need individual web imports for Firestore operations if you mix SDKs.

// To avoid mixing SDKs, we will rewrite the Firestore functions to use the native firestore() instance.

//--------------------------------
// 🔹 Firestore Services (UPDATED for native SDK)
//--------------------------------


// ✅ Add data
export const addData = async (collectionName, data) => {
    try {
        const docRef = await firestore().collection(collectionName).add(data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};


// ✅ Get all data
export const getAllData = async (collectionName) => {
    try {
        const querySnapshot = await firestore().collection(collectionName).get();
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw e;
    }
};

// ✅ Get single document
export const getDataById = async (collectionName, id) => {
    try {
        const docSnap = await firestore().collection(collectionName).doc(id).get();
        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        throw e;
    }
};

// ✅ Update document
export const updateData = async (collectionName, id, newData) => {
    try {
        await firestore().collection(collectionName).doc(id).update(newData);
        console.log("Document updated successfully");
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
};

// ✅ Delete document
export const deleteData = async (collectionName, id) => {
    try {
        await firestore().collection(collectionName).doc(id).delete();
        console.log("Document deleted successfully");
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
};

//--------------------------------
// 🔹 Firebase Auth Services (UPDATED for native SDK)
//--------------------------------

// ✅ NEW: Function to send the verification email
export const sendVerificationEmail = async (user) => {
    try {
        // Native SDK calls the method directly on the user object
        await user.sendEmailVerification(); 
        console.log("Verification email sent!");
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        throw error;
    }
};


// ✅ Sign Up (UPDATED for native SDK)
export const handleSignUp = async (email, password, extraData = {}) => {
    try {
        // Native SDK uses .createUserWithEmailAndPassword on the auth() instance
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 🚨 STEP 1: Send the verification email immediately after signup
        await sendVerificationEmail(user); 

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: extraData.name,
            emailVerified: user.emailVerified,
            createdAt: new Date().toISOString(),
            ...extraData, 
        };

        // 🚨 STEP 2: Save the user data to Firestore (using native set call)
        await firestore().collection("users").doc(user.uid).set(userData);

        return userData;
    } catch (error) {
        console.error("Error signing up:", error.message);
        throw error;
    }
};

// ✅ Login (UPDATED for native SDK)
export const login = async (email, password) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};

// ✅ Forgot Password (UPDATED for native SDK)
export const forgotPassword = async (email) => {
    try {
        await auth().sendPasswordResetEmail(email);
        console.log("Password reset email sent!");
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
};

// ✅ Logout (UPDATED for native SDK)
export const logout = async () => {
    try {
        await auth().signOut();
        console.log("User logged out successfully");
    } catch (error) {
        console.error("Error logging out:", error.message);
        throw error;
    }
};


