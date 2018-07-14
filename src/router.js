import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
// import About from "./views/About.vue";
import StatsRoot from "./views/StatsRoot.vue";
import ResaleCosts from "./views/ResaleCosts.vue";
import WaitTimes from "./views/WaitTimes.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   component: About
    // },
    {
      path: "/stats",
      redirect: "/",
      component: StatsRoot,
      children: [
        {
          path: "/resale-costs",
          name: "resale-costs",
          component: ResaleCosts
        },
        {
          path: "/wait-times",
          name: "wait-times",
          component: WaitTimes
        }
      ]
    }
  ]
});
