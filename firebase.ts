// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getUser = async (username: string, password: string) => {
  try {    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username), where("password", "==", password));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const document = querySnapshot.docs[0];
      return document.data();
    } else {
      console.log("No matching documents found.");
    }
  } catch (error) {
    console.error('데이터 조회 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export default app;