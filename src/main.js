import { createApp } from "vue";
import Oruga from "@oruga-ui/oruga-next";
import JsonCSV from "vue-json-csv";
import { VueFire, VueFireFirestoreOptionsAPI } from "vuefire";
import VueGtag from "vue-gtag-next";

import App from "./App.vue";
import router from "./router";
import { firebaseApp } from "./firebase";

import "./global.scss";
import "@fortawesome/fontawesome-free/scss/fontawesome.scss";
import "@fortawesome/fontawesome-free/scss/solid.scss";
import "@fortawesome/fontawesome-free/scss/brands.scss";

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
app.use(VueGtag, {
  property: {
    id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  },
});
app.component("downloadCsv", JsonCSV);

app.mount("#app");
