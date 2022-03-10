// Import the functions you need from the SDKs you need
import firebase from "firebase";
// import fireapp from "firebase/app";
import fireapp from "firebase/app/dist/index.cjs.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Create your Project and Create a new Web App on firebase Console
// Initialize Firebase
const firebaseConfig = fireapp.initializeApp({
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
const rdb = firebase.database(firebaseConfig);

export { db, rdb, firebase };
