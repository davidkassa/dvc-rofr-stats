import Vue from "vue";
import Buefy from "buefy";
// const Buefy = () => import(/* webpackChunkName: "buefy" */ "buefy");
import JsonCSV from "vue-json-csv";

import VueAnalytics from "vue-analytics";

import { firestorePlugin } from "vuefire";

import App from "./App.vue";
import router from "./router";
//import "./registerServiceWorker";

//import "buefy/lib/buefy.css";
import "./global.scss";
import "@fortawesome/fontawesome-free-webfonts/scss/fontawesome.scss";
import "@fortawesome/fontawesome-free-webfonts/scss/fa-solid.scss";
import "@fortawesome/fontawesome-free-webfonts/scss/fa-brands.scss";

Vue.config.productionTip = false;

/* eslint-disable no-undef */

Vue.use(Buefy, { defaultIconPack: "fas" });
Vue.component("downloadCsv", JsonCSV);
Vue.use(VueAnalytics, {
  id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  router,
});
Vue.use(firestorePlugin);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
