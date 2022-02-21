import { initializeApp } from "firebase/app"
import { getFirestore, collection, query, where } from "firebase/firestore";
import * as moment from "moment";

// Initialize Firebase
var config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
};
/* eslint-enable no-undef */
const firebaseApp = initializeApp(config);
const firestore = getFirestore(firebaseApp);
const contracts = query(collection(firestore,"contracts"), where("dateSent",
      ">=",
      moment().subtract(3, "months").format(moment.HTML5_FMT.DATE)));

const meta = collection(firestore,"meta");

export const db = { contracts, meta};
