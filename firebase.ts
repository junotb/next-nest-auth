// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
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

export const getUser = async (username: string, password: string) => {
  try {
    const snapshot = await getDocs(query(collection(database, 'users'), where('username', '==', username), where('password', '==', password)));  
    if (snapshot.empty) {
      throw new Error('No datas');
    }

    let doc = snapshot.docs[0].data();
    
    const user: User = {
      account: null,
      id: doc.id,
      name: doc.username
    };
    return user;
  } catch (error) {
    console.error('데이터 조회 중 오류가 발생했습니다:', error);
    throw error;    
  }
};

export default app;