import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw",
    authDomain: "central-pod-372511.firebaseapp.com",
    databaseURL: "https://central-pod-372511-default-rtdb.firebaseio.com",
    projectId: "central-pod-372511",
    storageBucket: "central-pod-372511.appspot.com",
    messagingSenderId: "512911743972",
    appId: "1:512911743972:web:7c40bbc36c724fc22c05f1",
    measurementId: "G-YTN1ZX837R"
};

// init firebase
export const app = initializeApp(firebaseConfig);