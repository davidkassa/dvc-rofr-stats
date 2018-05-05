import Vue from "vue";
import Buefy from "buefy";

import VueFire from "vuefire";
import firebase from "firebase/app";
import "firebase/firestore";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import "buefy/lib/buefy.css";
import "@mdi/font/scss/materialdesignicons.scss";

Vue.config.productionTip = false;

Vue.use(Buefy);
Vue.use(VueFire);

/* eslint-disable no-undef */

// Initialize Firebase
var config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
};
/* eslint-enable no-undef */

firebase.initializeApp(config);
export const db = firebase.firestore();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
