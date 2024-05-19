import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, addDoc, setDoc } from 'firebase/firestore';
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

export const addCredentialsUser = async (name: string, username: string, password: string) => {
  try {
    const userRef = await addDoc(collection(database, 'users'), {
      name,
      username,
      password
    });
    return userRef.id;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`파이어베이스 오류: ${error.code} - ${error.message}`);
      throw new Error(`파이어베이스 오류: ${error.code} - ${error.message}`);
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
};

export const addOAuthUser = async (name: string, username: string, provider: { provider: string, providerAccountId: string }) => {
  try {
    const userRef = await addDoc(collection(database, 'users'), {
      name,
      username,
      provider
    });
    return userRef.id
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`파이어베이스 오류: ${error.code} - ${error.message}`);
      throw new Error(`파이어베이스 오류: ${error.code} - ${error.message}`);
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
};

export const getCredentialsUser = async (username: string, password: string) => {
  try {
    const snapshot = await getDocs(query(collection(database, 'users'), where('username', '==', username), where('password', '==', password)));  
    if (snapshot.empty) {
      console.error(`에러: ${username} 사용자가 존재하지 않습니다`);
      return null;
    }

    const doc = snapshot.docs[0];    
    const user: User = {
      provider: doc.data().provider,
      id: doc.id,
      name: doc.data().name,
      username: doc.data().username
    };
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`파이어베이스 오류: ${error.code} - ${error.message}`);
      throw new Error(`파이어베이스 오류: ${error.code} - ${error.message}`);
    } else if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
};

export const getOAuthUser = async (providerName: string, providerAccountId: string) => {
  try {
    const snapshot = await getDocs(query(collection(database, 'users'), where('provider.provider', '==', providerName), where('provider.providerAccountId', '==', providerAccountId)));  
    if (snapshot.empty) {
      console.error('사용자 정보가 존재하지 않습니다.');
      return null;
    }

    const doc = snapshot.docs[0];
    const user: User = {
      provider: doc.data().provider,
      id: doc.id,
      name: doc.data().name,
      username: doc.data().username
    };
    return user;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error(`파이어베이스 오류: ${error.code} - ${error.message}`);
      throw new Error(`파이어베이스 오류: ${error.code} - ${error.message}`);
    } else if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    } else {
      console.error('알 수 없는 오류가 발생했습니다.');
      throw new Error('알 수 없는 오류가 발생했습니다.');
    }
  }
};

export default { addCredentialsUser, addOAuthUser, getCredentialsUser, getOAuthUser };