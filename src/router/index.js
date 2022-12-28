import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
// import About from "./views/About.vue";
const StatsRoot = () => import(/*  */ "../views/StatsRoot.vue");
const CompareContracts = () => import("../views/CompareContracts.vue");
const ResaleCosts = () => import("../views/ResaleCosts.vue");
const WaitTimes = () => import("../views/WaitTimes.vue");

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
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
          component: CompareContracts,
        },
        {
          path: "/resale-costs",
          name: "resale-costs",
          component: ResaleCosts,
        },
        {
          path: "/wait-times",
          name: "wait-times",
          component: WaitTimes,
        },
      ],
    },
  ],
});
