// Import the functions you need from the SDKs you need
import firebase from "firebase";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Create your Project and Create a new Web App on firebase Console
// Initialize Firebase
const firebaseConfig = initializeApp({
  apiKey: "input your own apikey from your firebase console",
  authDomain: "your authDomain from firebase console",
  databaseURL: "databaseURL",
  projectId: "your projectID",
  storageBucket: "storageBucket",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
});

const db = firebaseConfig.firestore();
const rdb = getDatabase();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
const analytics = getAnalytics(firebaseConfig);
