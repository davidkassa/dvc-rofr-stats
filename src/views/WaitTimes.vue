<template>
<div class="columns">
  <div class="column">
    <purchase-status-pie-chart :waiting=waitingContracts.length :passed=passedContracts.length :taken=takenContracts.length class="chart" />
  </div>
  <div class="column">
    <!-- <resale-cost-boxplot :waiting=waitingContracts :passed=passedContracts :taken=takenContracts class="chart" /> -->
    <wait-time-line-chart :waiting=waitingContracts :passed=passedContracts :taken=takenContracts class="chart" />
  </div>
  <div class="column">
    <div class="v-center">
      <div class="average-wait">
        <div class="box-title">Average Wait Time<br/><span v-show="averageWaitTime !== 'NaN days'">{{averageWaitTime}}</span></div>
        <div class="columns">
          <div class="column">
            <div class="box-record"><b-icon pack="fas" icon="circle" size="is-small" type="is-passed" /> Passed:</div>
            <div class="box-record"><b-icon pack="fas" icon="circle" size="is-small" type="is-waiting" /> Waiting:</div>
            <div class="box-record"><b-icon pack="fas" icon="circle" size="is-small" type="is-taken" /> Taken:</div>
          </div>
          <div class="column">
            <div v-show="averagePassedWaitTime !== 'NaN days'"  class="box-record">{{averagePassedWaitTime}}</div>
            <div v-show="averageWaitingWaitTime !== 'NaN days'" class="box-record">{{averageWaitingWaitTime}}</div>
            <div v-show="averageTakenWaitTime !== 'NaN days'" class="box-record">{{averageTakenWaitTime}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import PurchaseStatusPieChart from "@/components/PurchaseStatusPieChart.vue"; // @ is an alias to /src
// import ResaleCostBoxplot from "@/components/ResaleCostBoxplot.vue"; // @ is an alias to /src
import WaitTimeLineChart from "@/components/WaitTimeLineChart.vue"; // @ is an alias to /src
import * as moment from "moment";

export default {
  components: {
    PurchaseStatusPieChart,
    WaitTimeLineChart
  },
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
  },
  methods: {
    getAverageWaitTime: function(contracts) {
      // console.log(contracts);
      var sum = contracts.reduce(function(prevVal, elem) {
        let resolved = moment(elem.dateResolved, moment.HTML5_FMT.DATE);
        if (!resolved.isValid()) {
          resolved = moment();
        }
        let sent = moment(elem.dateSent, moment.HTML5_FMT.DATE);
        let waiting = resolved.diff(sent, "days");
        // console.log(`resolved: ${resolved} sent: ${sent} waiting: ${waiting} `);

        return prevVal + waiting;
      }, 0);
      var avg = sum / contracts.length;
      return avg.toFixed(2) + " days";
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
.average-wait {
  border: 1px solid black;
  border-radius: 25px;
  width: 200px;
  height: 200px;
  padding: 5px;
  text-align: left;
  .box-title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
