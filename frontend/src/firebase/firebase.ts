import { initializeApp } from 'firebase/app';
import { onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from 'firebase/auth';
import { useUserStore } from '../store/useUserStore';
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjZe5kQsF4h1IlYw1hECXSc7TivxlpVJU",
    authDomain: "fuelbuddy-2d6ee.firebaseapp.com",
    projectId: "fuelbuddy-2d6ee",
    storageBucket: "fuelbuddy-2d6ee.firebasestorage.app",
    messagingSenderId: "917972084440",
    appId: "1:917972084440:web:67478f12268ede5d2719ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Listen for authentication state changes
const initializeAuthListener = () => {
    const userStore = useUserStore(); // Get the Pinia store
  
    onAuthStateChanged(auth, async(user) => {
        
      if (user) {
        // User is signed in, update the store
        userStore.user = user;
        console.log('User is signed in alpha:', user);
      } else {
        // No user is signed in, reset the store user state
        userStore.user = null;
        console.log('No user signed in beta');
      }
    });
};

export { auth, initializeAuthListener, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  };
