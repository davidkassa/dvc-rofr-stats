<template>
  <div class="columns">
    <div class="column">
      <purchase-status-pie-chart
        :waiting="waitingContracts.length"
        :passed="passedContracts.length"
        :taken="takenContracts.length"
        class="chart"
      />
    </div>
    <div class="column">
      <!--
        <resale-cost-boxplot :waiting=waitingContracts :passed=passedContracts :taken=takenContracts class="chart" />
      -->
      <wait-time-line-chart
        :waiting="waitingContracts"
        :passed="passedContracts"
        :taken="takenContracts"
        class="chart"
      />
    </div>
    <div class="column">
      <stat-box
        title="Average Wait Time"
        :total="averageWaitTime"
        :passed="averagePassedWaitTime"
        :waiting="averageWaitingWaitTime"
        :taken="averageTakenWaitTime"
      />
    </div>
  </div>
</template>

<script>
import PurchaseStatusPieChart from "@/components/PurchaseStatusPieChart.vue"; // @ is an alias to /src
// import ResaleCostBoxplot from "@/components/ResaleCostBoxplot.vue"; // @ is an alias to /src
import WaitTimeLineChart from "@/components/WaitTimeLineChart.vue"; // @ is an alias to /src
import StatBox from "@/components/StatBox.vue";
import aggregate from "@/util/aggregate";

export default {
  components: {
    PurchaseStatusPieChart,
    WaitTimeLineChart,
    StatBox
  },
  mixins: [aggregate],
  props: ["contracts", "passedContracts", "waitingContracts", "takenContracts"],
  computed: {
    averageWaitTime: function() {
      return this.getAverageWaitTime(this.contracts);
    },
    averagePassedWaitTime: function() {
      return this.getAverageWaitTime(this.passedContracts);
    },
    averageWaitingWaitTime: function() {
      return this.getAverageWaitTime(this.waitingContracts);
    },
    averageTakenWaitTime: function() {
      return this.getAverageWaitTime(this.takenContracts);
    }
  }
};
</script>

<style scoped lang="scss">
.chart {
  max-width: 400px;
  display: inline-block;
}
</style>
