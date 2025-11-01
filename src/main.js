import { createApp } from "vue";
import Oruga from "@oruga-ui/oruga-next";
import JsonCSV from "vue-json-csv";
import { VueFire, VueFireFirestoreOptionsAPI } from "vuefire";

import App from "./App.vue";
import router from "./router";
import { firebaseApp } from "./firebase";

import "./global.scss";
import "@fortawesome/fontawesome-free/scss/fontawesome.scss";
import "@fortawesome/fontawesome-free/scss/solid.scss";
import "@fortawesome/fontawesome-free/scss/brands.scss";

import { configure } from "vue-gtag";

configure({
  tagId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
});

const app = createApp(App);

app.use(router);
app.use(Oruga, {
  iconPack: "fas",
});
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireFirestoreOptionsAPI({
      // Suppress SSR warnings for complex queries
      reset: false,
    }),
  ],
});
app.component("downloadCsv", JsonCSV);

app.mount("#app");
