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

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD0795zezCZcML2tL5jXGe08IpQx26eIkM",
  authDomain: "dvc-rofr-stats-dev.firebaseapp.com",
  databaseURL: "https://dvc-rofr-stats-dev.firebaseio.com",
  projectId: "dvc-rofr-stats-dev",
  storageBucket: "dvc-rofr-stats-dev.appspot.com",
  messagingSenderId: "365161053410"
};
firebase.initializeApp(config);
export const db = firebase.firestore();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
