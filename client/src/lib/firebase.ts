import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cuca-database.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase configuration is complete
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;

let auth: any = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
}

export { auth, googleProvider };

// Sign in with Google
export const signInWithGoogle = () => {
  if (!auth || !googleProvider) {
    console.warn('Firebase not configured - authentication unavailable');
    return Promise.reject(new Error('Firebase not configured'));
  }
  return signInWithRedirect(auth, googleProvider as GoogleAuthProvider);
};

// Handle redirect result
export const handleRedirectResult = () => {
  if (!auth) {
    console.warn('Firebase not configured - authentication unavailable');
    return Promise.resolve(null);
  }
  return getRedirectResult(auth);
};

// Sign out
export const signOutUser = () => {
  if (!auth) {
    console.warn('Firebase not configured - authentication unavailable');
    return Promise.resolve();
  }
  return signOut(auth);
};

// Auth state observer
export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!auth) {
    console.warn('Firebase not configured - authentication unavailable');
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};