<template>
  <div class="data">
    <div class="columns">
      <div class="column">
        <purchase-status-pie-chart :waiting=waitingContracts.length :passed=passedContracts.length :taken=takenContracts.length class="chart" />
      </div>
      <div class="column">
        <div class="v-center">
          <div class="average-price">Average Price {{averagePrice}} Passed {{averagePassedPrice}} Taken {{averageTakenPrice}} Waiting {{averageWaitingPrice}}</div>
        </div>
      </div>
    </div>
    <div class="data-details">
      <div class="left-container">
        <rofr-dropdown class="left" />
        <!-- <rofr-dropdown :data=contractData /> -->
      </div>
      <rofr-data-table :data=contractData />
    </div>
  </div>
</template>

<script>
import PurchaseStatusPieChart from "@/components/PurchaseStatusPieChart.vue"; // @ is an alias to /src
import RofrDataTable from "@/components/RofrDataTable.vue";
import RofrDropdown from "@/components/RofrDropdown.vue";
//import jsonData from "@/../data/4.2018.json";
import { db } from "../main";

export default {
  components: {
    PurchaseStatusPieChart,
    RofrDataTable,
    RofrDropdown
  },
  data() {
    return {
      contracts: []
    };
  },
  firestore() {
    return {
      contracts: db.collection("contracts")
    };
  },
  computed: {
    contractData: function() {
      return this.contracts.filter(a => a.Resort == "AKV");
      //return jsonData.filter(a => a.Resort == "AKV");
    },
    averagePrice: function() {
      return this.getAverage(this.contractData);
    },
    passedContracts: function() {
      //return this.contractData.where("Status", "==", "Passed");
      return this.contractData.filter(a => a.Status == "Passed");
    },
    averagePassedPrice: function() {
      return this.getAverage(this.passedContracts);
    },
    waitingContracts: function() {
      //return this.contractData.where("Status", "==", "Waiting");
      return this.contractData.filter(a => a.Status == "Waiting");
    },
    averageWaitingPrice: function() {
      return this.getAverage(this.waitingContracts);
    },
    takenContracts: function() {
      //return this.contractData.where("Status", "==", "Taken");
      return this.contractData.filter(a => a.Status == "Taken");
    },
    averageTakenPrice: function() {
      return this.getAverage(this.takenContracts);
    }
  },
  methods: {
    getAverage: function(contracts) {
      // console.log(contracts);
      var sum = contracts.reduce(function(prevVal, elem) {
        return prevVal + elem.PricePerPoint;
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
  height: 200px;
  padding: 5px;
}
.data-details {
  margin: 1%;
}
.left-container {
  width: 100%;
  display: inline-block;
  .left {
    float: left;
  }
}
</style>
