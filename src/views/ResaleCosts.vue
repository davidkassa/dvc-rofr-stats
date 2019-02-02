<template>
  <div class="columns">
    <div class="column">
      <resale-cost-boxplot
        :waiting="waitingContracts"
        :passed="passedContracts"
        :taken="takenContracts"
        class="chart"
      />
    </div>
    <div class="column">
      <resale-cost-line-chart
        :waiting="waitingContracts"
        :passed="passedContracts"
        :taken="takenContracts"
        class="chart"
      />
    </div>
    <div class="column">
      <stat-box
        title="Average Price"
        :total="averagePrice"
        :passed="averagePassedPrice"
        :waiting="averageWaitingPrice"
        :taken="averageTakenPrice"
      />
    </div>
  </div>
</template>

<script>
import ResaleCostBoxplot from "@/components/ResaleCostBoxplot.vue"; // @ is an alias to /src
import ResaleCostLineChart from "@/components/ResaleCostLineChart.vue";
import StatBox from "@/components/StatBox.vue";
import aggregate from "@/util/aggregate";

export default {
  components: {
    ResaleCostBoxplot,
    ResaleCostLineChart,
    StatBox
  },
  props: ["contracts", "passedContracts", "waitingContracts", "takenContracts"],
  mixins: [aggregate],
  computed: {
    averagePrice: function() {
      return this.getAveragePricePerPoint(this.contracts);
    },
    averagePassedPrice: function() {
      return this.getAveragePricePerPoint(this.passedContracts);
    },
    averageWaitingPrice: function() {
      return this.getAveragePricePerPoint(this.waitingContracts);
    },
    averageTakenPrice: function() {
      return this.getAveragePricePerPoint(this.takenContracts);
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
