import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth, setPersistence, browserSessionPersistence} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrMjubJdPrWEjDLH3ZBC74imn0JBG-I-U",
  authDomain: "marketplace-bdc58.firebaseapp.com",
  projectId: "marketplace-bdc58",
  storageBucket: "marketplace-bdc58.appspot.com",
  messagingSenderId: "1093850461804",
  appId: "1:1093850461804:web:2ebf3d3603d855e88b4a49",
  measurementId: "G-58NYR850PE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);