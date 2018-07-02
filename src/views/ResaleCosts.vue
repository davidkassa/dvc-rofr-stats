<template>
  <div class="data">
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
    <div class="data-details">
      <div class="float-container">
        <rofr-dropdown class="left" 
            @statusFilterChanged="updateStatusFilter"
            @resortFilterChanged="updateResortFilter"
            @useYearFilterChanged="updateUseYearFilter" />
        <!-- pass data to child to disable values -->
        <!-- <rofr-dropdown :data=contractData /> -->
        <a v-show="Object.keys(meta).length !== 0" class="right" :href="meta.url" target="_blank">{{meta.text}} Last Updated: {{ meta.epoch | moment }}</a>
      </div>
      <rofr-data-table :data=contractData />
    </div>
  </div>
</template>

<script>
import ResaleCostBoxplot from "@/components/ResaleCostBoxplot.vue"; // @ is an alias to /src
import ResaleCostLineChart from "@/components/ResaleCostLineChart.vue";
import RofrDataTable from "@/components/RofrDataTable.vue";
import RofrDropdown from "@/components/RofrDropdown.vue";
import { db } from "../main";
import * as moment from "moment";

export default {
  components: {
    ResaleCostBoxplot,
    ResaleCostLineChart,
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
      // console.log(this.metaStore.find(d => d.active === true));
      return this.metaStore.length == 0 ? {} : this.metaStore.find(d => d.active === true);
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
  },
  filters: {
    moment: function(date) {
      return moment.unix(Number(date)).format("ddd, MMM D LT"); //.format('MMMM Do YYYY, h:mm:ss a');
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
