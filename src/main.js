import Vue from "vue";
import Oruga from "@oruga-ui/oruga-next";
import JsonCSV from "vue-json-csv";

import VueAnalytics from "vue-analytics";

import { firestorePlugin } from "vuefire";

import App from "./App.vue";
import router from "./router";
import store from "./store";
//import "./registerServiceWorker";

import "./global.scss";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircle, faFileExcel } from '@fortawesome/free-solid-svg-icons'
library.add(faCircle)
library.add(faFileExcel)
import { faFortAwesome, faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(faFortAwesome)
library.add(faGithub)
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

/* eslint-disable no-undef */

Vue.use(Oruga, { iconComponent: 'vue-fontawesome', iconPack: "fas" });
Vue.component("downloadCsv", JsonCSV);
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID,
  router,
});
Vue.use(firestorePlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
