<template>
  <div class="home">
    <img class="logo" src="../assets/logo.png" />
    <h1>Welcome to DVC Stats</h1>
    <p>
      A simple application to visualize trends of Disney Vacation Club
      Right-of-First-Refusal data provided by members of
      <a
        href="https://www.disboards.com/forums/purchasing-dvc.28/"
        target="_blank"
        >disboards.com</a
      >.
    </p>
    <h3>How to Use</h3>
    <p>
      Click on the ROFR
      <router-link to="/resale-costs">resale costs</router-link> link to slice
      and dice.<br />
      More features are planned including wait times and contract comparison.<br />
      <feedback-dialog>Feel free to provide any feedback.</feedback-dialog>
    </p>
  </div>
</template>

<script>
import FeedbackDialog from "@/components/FeedbackDialog.vue";

export default {
  name: "Home",
  components: { FeedbackDialog },
};
</script>

<style lang="scss" scoped>
.logo {
  max-height: 300px;
}

p {
  max-width: 45%;
  text-align: center;
  margin: 0 auto;
}
</style>
