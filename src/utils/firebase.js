// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, updatePassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCm-0fSD0ioYsEXbcj9eavGj4JqrfVrl-o",
    authDomain: "system-gis-panembangan.firebaseapp.com",
    projectId: "system-gis-panembangan",
    storageBucket: "system-gis-panembangan.firebasestorage.app",
    messagingSenderId: "674394346795",
    appId: "1:674394346795:web:a9c61d7d151798a5dba16e",
    measurementId: "G-91SMZX518L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, updatePassword };