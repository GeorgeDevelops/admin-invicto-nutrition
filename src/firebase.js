// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyArFHGoDjtol6dcGpZ6PsMAq2aK6_MGY5E",
    authDomain: "invicto-nutrition.firebaseapp.com",
    projectId: "invicto-nutrition",
    storageBucket: "invicto-nutrition.appspot.com",
    messagingSenderId: "1042203662780",
    appId: "1:1042203662780:web:ffb82d69a930571a12f3b9",
    measurementId: "G-XDWJPD65BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);