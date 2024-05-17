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

export const addUser = async (username: string, password: string | null, provider: Provider | null) => {
  try {
    const userRef = await addDoc(collection(database, 'users'), {
      username: username,
      password,
      provider
    });
    return userRef.id
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`Firebase error: ${error.code} - ${error.message}`);
      throw new Error(`Firebase error: ${error.code} - ${error.message}`);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};

export const getUser = async (username: string, password: string) => {
  try {
    const snapshot = await getDocs(query(collection(database, 'users'), where('username', '==', username), where('password', '==', password)));  
    if (snapshot.empty) {
      console.error('User is not existed');
      throw new Error('User is not existed');
    }

    let doc = snapshot.docs[0].data();
    
    const user: User = {
      provider: doc.provider,
      id: doc.provider.account_id,
      name: doc.username,
    };
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`Firebase error: ${error.code} - ${error.message}`);
      throw new Error(`Firebase error: ${error.code} - ${error.message}`);
    } else if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};

export const getSnsUser = async (providerName: string, providerAccountId: string) => {
  try {
    const snapshot = await getDocs(query(collection(database, 'users'), where('provider.name', '==', providerName), where('provider.account_id', '==', providerAccountId)));  
    if (snapshot.empty) {
      console.error('User is not existed');
      // getUser와 다르게 Error 처리하지 않음
      return null;
    }

    let doc = snapshot.docs[0].data();
    
    const user: User = {
      provider: doc.provider,
      id: doc.provider.account_id,
      name: doc.username,
    };
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`Firebase error: ${error.code} - ${error.message}`);
      throw new Error(`Firebase error: ${error.code} - ${error.message}`);
    } else if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};

export default { addUser, getUser, getSnsUser };