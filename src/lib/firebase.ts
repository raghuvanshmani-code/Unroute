import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  projectId: 'studio-3336351462-b5547',
  appId: '1:307554428473:web:bb93cb9ce8540568b68fe8',
  apiKey: 'AIzaSyBSYY-QcV7HHTt_-jkt-GTNyaM-YjDOd5Q',
  authDomain: 'studio-3336351462-b5547.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '307554428473',
};

function getFirebaseInstances() {
  if (!firebaseConfig.authDomain) {
    throw new Error('Firebase authDomain is not configured.');
  }
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  return { app, auth, googleProvider };
}

const { app, auth, googleProvider } = getFirebaseInstances();

export { app, auth, googleProvider };
