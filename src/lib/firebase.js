// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
	getAuth,
	GoogleAuthProvider,
	FacebookAuthProvider,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	updateProfile,
	getAdditionalUserInfo,
	deleteUser,
	onAuthStateChanged,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from "firebase/storage";

import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_FIREBASE_APPID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Providers
const providerGoogle = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

// Firebase Storage
const storage = getStorage(app);

export {
	app,
	auth,
	providerGoogle,
	providerFacebook,
	signInWithPopup,
	updateProfile,
	deleteUser,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	getAdditionalUserInfo,
	onAuthStateChanged,
  signOut,
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
  storage
};
