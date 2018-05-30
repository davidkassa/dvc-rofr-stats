<template>
  <div class="data">
    <div class="columns">
      <div class="column">
        <purchase-status-pie-chart :waiting=waitingContracts.length :passed=passedContracts.length :taken=takenContracts.length class="chart" />
      </div>
      <div class="column">
        <resale-cost-candlestick class="chart" />
      </div>
      <div class="column">
        <div class="v-center">
          <div class="average-price">Average Price {{averagePrice}} Passed {{averagePassedPrice}} Taken {{averageTakenPrice}} Waiting {{averageWaitingPrice}}</div>
        </div>
      </div>
    </div>
    <div class="data-details">
      <div class="float-container">
        <rofr-dropdown class="left" 
            @statusFilterChanged="updateStatusFilter"
            @resortFilterChanged="updateResortFilter"
            @useYearFilterChanged="updateUseYearFilter" />
        <!-- pass data to child to disable values -->
        <!-- <rofr-dropdown :data=contractData /> -->
        <a v-show="Object.keys(meta).length !== 0" class="right" :href="meta.url" target="_blank">Last Updated: {{ meta.lastUpdated }}</a>
      </div>
      <rofr-data-table :data=contractData />
    </div>
  </div>
</template>

<script>
import PurchaseStatusPieChart from "@/components/PurchaseStatusPieChart.vue"; // @ is an alias to /src
import ResaleCostCandlestick from "@/components/ResaleCostCandlestick.vue"; // @ is an alias to /src
import RofrDataTable from "@/components/RofrDataTable.vue";
import RofrDropdown from "@/components/RofrDropdown.vue";
import { db } from "../main";

export default {
  components: {
    PurchaseStatusPieChart,
    ResaleCostCandlestick,
    RofrDataTable,
    RofrDropdown
  },
  data() {
    return {
      contracts: [],
      metaStore: [],
      statusFilter: [],
      resortFilter: [],
      useYearFilter: []
    };
  },
  firestore() {
    return {
      contracts: db.collection("contracts"),
      metaStore: db.collection("meta")
    };
  },
  computed: {
    meta: function() {
      // console.log(this.metaStore.find(m => m));
      return this.metaStore.length == 0 ? {} : this.metaStore.find(m => m);
    },
    contractData: function() {
      return this.contracts
        .filter(
          a =>
            this.statusFilter.length != 0 &&
            this.statusFilter.indexOf(a.status) !== -1
        )
        .filter(
          a =>
            this.resortFilter.length != 0 &&
            this.resortFilter.indexOf(a.resort) !== -1
        )
        .filter(
          a =>
            this.useYearFilter.length != 0 &&
            this.useYearFilter.indexOf(a.useYear) !== -1
        );
    },
    averagePrice: function() {
      return this.getAverage(this.contractData);
    },
    passedContracts: function() {
      //return this.contractData.where("Status", "==", "Passed");
      return this.contractData.filter(a => a.status == "Passed");
    },
    averagePassedPrice: function() {
      return this.getAverage(this.passedContracts);
    },
    waitingContracts: function() {
      //return this.contractData.where("Status", "==", "Waiting");
      return this.contractData.filter(a => a.status == "Waiting");
    },
    averageWaitingPrice: function() {
      return this.getAverage(this.waitingContracts);
    },
    takenContracts: function() {
      //return this.contractData.where("Status", "==", "Taken");
      return this.contractData.filter(a => a.status == "Taken");
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
    },
    updateStatusFilter: function(statusFilter) {
      //console.log("Status Filter Changed:\n" + JSON.stringify(statusFilter) + "\n");
      this.statusFilter = statusFilter;
    },
    updateResortFilter: function(resortFilter) {
      //console.log("Resort Filter Changed:\n" + JSON.stringify(resortFilter) + "\n");
      this.resortFilter = resortFilter;
    },
    updateUseYearFilter: function(useYearFilter) {
      //console.log("Use Year Filter Changed:\n" + JSON.stringify(useYearFilter) + "\n");
      this.useYearFilter = useYearFilter;
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
.float-container {
  width: 100%;
  display: inline-block;
  .left {
    float: left;
  }
  .right {
    float: right;
  }
}
</style>
