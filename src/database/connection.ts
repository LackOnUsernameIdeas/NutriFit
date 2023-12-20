import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDwqaIBGxmhEc6GVR3lwOVk_-0EpwKvOPA",
    authDomain: "nutrifit-ed16d.firebaseapp.com",
    projectId: "nutrifit-ed16d",
    storageBucket: "nutrifit-ed16d.appspot.com",
    messagingSenderId: "545280060552",
    appId: "1:545280060552:web:6310a9073b1c04855e833d",
    measurementId: "G-M517PKG0NX"
};

// init firebase
export const app = initializeApp(firebaseConfig);