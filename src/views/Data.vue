<template>
  <div class="data">
    <h1>This is the data page</h1>
    <purchase-status-pie-chart :waiting=10 :passed=6 :taken=4 />
  </div>
</template>

<script>
import PurchaseStatusPieChart from '@/components/PurchaseStatusPieChart.vue'; // @ is an alias to /src

export default {
  components: {
    PurchaseStatusPieChart
  }
};
</script>



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
