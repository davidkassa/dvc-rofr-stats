<template>
  <div class="columns">
    <div class="column">
      <resale-cost-boxplot :waiting=waitingContracts :passed=passedContracts :taken=takenContracts class="chart" />
    </div>
    <div class="column">
      <resale-cost-line-chart :waiting=waitingContracts :passed=passedContracts :taken=takenContracts class="chart" />
    </div>
    <div class="column">
      <stat-box title="Average Price" :total=averagePrice :passed=averagePassedPrice :waiting=averageWaitingPrice :taken=averageTakenPrice />
    </div>
  </div>
</template>

<script>
import ResaleCostBoxplot from "@/components/ResaleCostBoxplot.vue"; // @ is an alias to /src
import ResaleCostLineChart from "@/components/ResaleCostLineChart.vue";
import StatBox from "@/components/StatBox.vue";

export default {
  components: {
    ResaleCostBoxplot,
    ResaleCostLineChart,
    StatBox
  },
  props: ["contracts", "passedContracts", "waitingContracts", "takenContracts"],
  computed: {
    averagePrice: function() {
      return this.getAverage(this.contracts);
    },
    averagePassedPrice: function() {
      return this.getAverage(this.passedContracts);
    },
    averageWaitingPrice: function() {
      return this.getAverage(this.waitingContracts);
    },
    averageTakenPrice: function() {
      return this.getAverage(this.takenContracts);
    }
  },
  methods: {
    getAverage: function(contracts) {
      // console.log(contracts);
      var sum = contracts.reduce(function(prevVal, elem) {
        return prevVal + elem.pricePerPoint;
      }, 0);
      var avg = sum / contracts.length;
      return "$" + avg.toFixed(2);
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
