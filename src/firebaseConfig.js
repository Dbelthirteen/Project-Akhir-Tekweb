// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC8BDIvsS5aiVMjV76Dop-QOd6Mq3npV5c",
    authDomain: "sahabatdiri-d5c19.firebaseapp.com",
    projectId: "sahabatdiri-d5c19",
    storageBucket: "sahabatdiri-d5c19.firebasestorage.app",
    messagingSenderId: "528302110177",
    appId: "1:528302110177:web:69b692ff7c7b53a3678ea0",
  };

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication
export const auth = getAuth(app);
