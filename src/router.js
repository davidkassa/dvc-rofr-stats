import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
// import About from "./views/About.vue";
const StatsRoot = () => import(/*  */ "./views/StatsRoot.vue");
const CompareContracts = () =>
  import(/* webpackChunkName: "compare-contracts" */ "./views/CompareContracts.vue");
const ResaleCosts = () =>
  import(/* webpackChunkName: "resale-costs" */ "./views/ResaleCosts.vue");
const WaitTimes = () =>
  import(/* webpackChunkName: "wait-times" */ "./views/WaitTimes.vue");

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
          path: "/compare-contracts",
          name: "compare-contracts",
          component: CompareContracts
        },
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
