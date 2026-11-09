import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Optional: Replace with your actual Firebase config in .env.local for multi-device sync.
// If not configured, the app automatically runs in fast LocalStorage + Instant State mode!
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let db = null;
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
}

export { db };
