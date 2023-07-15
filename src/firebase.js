import firebase from "firebase/compat/app";
// const firebase = () =>
//   import(/* webpackChunkName: "firebase" */ "firebase/app");
import "firebase/compat/firestore";

// Initialize Firebase
var config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};
/* eslint-enable no-undef */

firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {
  /* your settings... */
  merge: true,
};
firestore.settings(settings);
export const db = firestore;
