import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-3336351462-b5547',
  appId: '1:307554428473:web:bb93cb9ce8540568b68fe8',
  apiKey: 'AIzaSyBSYY-QcV7HHTt_-jkt-GTNyaM-YjDOd5Q',
  authDomain: 'studio-3336351462-b5547.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '307554428473',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
