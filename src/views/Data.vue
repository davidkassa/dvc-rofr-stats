<template>
  <div class="data">
    <h1>This is the data page</h1>
    <purchase-status-pie-chart :waiting=waiting :passed=passed :taken=taken class="chart" />
  </div>
</template>

<script>
import PurchaseStatusPieChart from "@/components/PurchaseStatusPieChart.vue"; // @ is an alias to /src
import jsonData from "@/../data/4.2018.json";

export default {
  components: {
    PurchaseStatusPieChart
  },
  data() {
    return {
      waiting: this.waiting,
      passed: this.passed,
      taken: this.taken
    };
  },
  mounted() {
    this.loadJson();
  },
  methods: {
    loadJson() {
      // console.log(jsonData);
      this.waiting = jsonData.find(a => a.name == "Waiting").count;
      this.passed = jsonData.find(a => a.name == "Passed").count;
      this.taken = jsonData.find(a => a.name == "Taken").count;
    }
  }
};
</script>

<style scoped lang="scss">
.chart {
  max-width: 400px;
}
</style>


// {
//   labels: ['January', 'February'],
//   datasets: [
//     {
//       label: 'GitHub Commits',
//       backgroundColor: '#f87979',
//       data: [40, 20]
//     }
//   ]
// }
