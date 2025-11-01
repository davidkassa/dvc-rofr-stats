import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const StatsRoot = () => import(/*  */ "../views/StatsRoot.vue");
const CompareContracts = () => import("../views/CompareContracts.vue");
const ResaleCosts = () => import("../views/ResaleCosts.vue");
const WaitTimes = () => import("../views/WaitTimes.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
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

export default router;
