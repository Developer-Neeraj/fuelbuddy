import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '../firebase/firebase';
import router from '../router/index';
export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null);
  const errorMessage = ref<string | null>(null);

  const register = async (email: string, password: string, username: string) => {
    try {
        console.log('Registering user:', email, password, username);

        // Create a new user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
        // // Set user in the store
        user.value = userCredential.user;
        try {
          const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: user.value.email, username: username, firebaseuserid: user.value.uid}),
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
        }
        router.push('/login');
        // Clear the error message on successful registration
        errorMessage.value = null;

    } catch (error: any) {
      // Catch any errors and display the error message
      console.log('error.message', error.message)
      errorMessage.value = error.message;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
        console.log('Signing in user:', email);
        // Sign-in the user with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Store user information in the store after successful sign-in
        user.value = userCredential.user;

        try {
          const response = await fetch(`http://localhost:3000/api/users/${user.value.uid}`);
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const updatedTask = await response.json();
         localStorage.setItem('username', updatedTask.username);
        } catch (error) {
          console.error('Error submitting form:', error);
        }
        

        router.push('/dashboard');
        // Optionally: Fetch user data from Firestore if needed (for example, if you have extra data stored in Firestore)
        // const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        // const userData = userDoc.data();
        // user.value = { ...userCredential.user, ...userData };

        // Clear any previous error messages
        errorMessage.value = null;

    } catch (error: any) {
        // If an error occurs during sign-in, capture and display the error message
        errorMessage.value = error.message;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Log out from Firebase
      await signOut(auth);

      // Clear user data from store
      user.value = null;
      localStorage.clear()
      console.log('User has been logged out');
    } catch (error: any) {
      // Handle any errors that occur during logout
      errorMessage.value = error.message;
    }
  };


  return { user, errorMessage, register, signIn, logout };
}, {
    persist: true  // This will persist the state across page reloads
});
