// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9bvRbYeh5lJd4s8N9vHa_70ykhJfevLQ",
  authDomain: "northeast-hp.firebaseapp.com",
  projectId: "northeast-hp",
  storageBucket: "northeast-hp.firebasestorage.app",
  messagingSenderId: "870076704961",
  appId: "1:870076704961:web:542bbb02723146a0e1cc40",
  measurementId: "G-3M35MTWPBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Configure reCAPTCHA
export const setupRecaptcha = (containerId: string) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    }
  });
  return window.recaptchaVerifier;
};

// Send OTP to phone number
export const sendOTP = async (phoneNumber: string) => {
  try {
    const recaptchaVerifier = window.recaptchaVerifier || setupRecaptcha('recaptcha-container');
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, error: null };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { confirmationResult: null, error };
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult: any, otp: string) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { user: null, error };
  }
};

export { app, analytics, auth };