import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "piedra-papel-o-tijeras-97acf.firebaseapp.com",
    projectId: "piedra-papel-o-tijeras-97acf",
    storageBucket: "piedra-papel-o-tijeras-97acf.appspot.com",
    messagingSenderId: "401328611115",
    appId: "1:401328611115:web:9801abf21f6b25ad412f6e",
    measurementId: "G-7LQ6ZBYFMZ",
    databaseURL: "https://piedra-papel-o-tijeras-97acf-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(app);
const realtimeDb = getDatabase(app);

export { firestoreDb, realtimeDb, collection, addDoc, doc, getDoc, updateDoc };
