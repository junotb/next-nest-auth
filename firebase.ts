import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { User } from 'next-auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export const addUser = async (username: string, password: string) => {
  try {
    const userRef = await addDoc(collection(database, 'users'), {
      username,
      password
    });
    return userRef.id
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`Firebase error: ${error.code} - ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const getUser = async (username: string, password: string) => {
  try {
    const snapshot = await getDocs(query(collection(database, 'users'), where('username', '==', username), where('password', '==', password)));  
    if (snapshot.empty) {
      throw new Error('No datas');
    }

    let doc = snapshot.docs[0].data();
    
    const user: User = {
      id: doc.id,
      name: doc.username,
      account: null
    };
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`Firebase error: ${error.code} - ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export default { addUser, getUser };