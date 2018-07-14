<template>
  <div class="columns">
    <div class="column">
      <resale-cost-boxplot :waiting=waitingContracts :passed=passedContracts :taken=takenContracts class="chart" />
    </div>
    <div class="column">
      <resale-cost-line-chart :waiting=waitingContracts :passed=passedContracts :taken=takenContracts class="chart" />
    </div>
    <div class="column">
      <div class="v-center">
        <div class="average-price">
          <div class="box-title">Average Price<br/><span v-show="averagePrice !== '$NaN'">{{averagePrice}}</span></div>
            <div class="columns">
              <div class="column">
                <div class="box-record"><b-icon pack="fas" icon="circle" size="is-small" type="is-passed" /> Passed:</div>
                <div class="box-record"><b-icon pack="fas" icon="circle" size="is-small" type="is-waiting" /> Waiting:</div>
                <div class="box-record"><b-icon pack="fas" icon="circle" size="is-small" type="is-taken" /> Taken:</div>
              </div>
              <div class="column">
                <div v-show="averagePassedPrice !== '$NaN'"  class="box-record">{{averagePassedPrice}}</div>
                <div v-show="averageWaitingPrice !== '$NaN'" class="box-record">{{averageWaitingPrice}}</div>
                <div v-show="averageTakenPrice !== '$NaN'" class="box-record">{{averageTakenPrice}}</div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResaleCostBoxplot from "@/components/ResaleCostBoxplot.vue"; // @ is an alias to /src
import ResaleCostLineChart from "@/components/ResaleCostLineChart.vue";

export default {
  components: {
    ResaleCostBoxplot,
    ResaleCostLineChart
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
.v-center {
  display: flex;
  align-items: center;
  justify-content: left;
  height: 100%;
}
.average-price {
  border: 1px solid black;
  border-radius: 25px;
  width: 200px;
  height: 250px;
  padding: 5px;
  text-align: left;
  .box-title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
