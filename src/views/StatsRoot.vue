<template>
  <div class="data">
    <router-view :contracts=contractData :waitingContracts=waitingContracts :passedContracts=passedContracts :takenContracts=takenContracts />
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
import RofrDataTable from "@/components/RofrDataTable.vue";
import RofrDropdown from "@/components/RofrDropdown.vue";
import { db } from "../main";
import * as moment from "moment";

export default {
  components: {
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
      contracts: db.collection("contracts").where(
        "dateSent",
        ">=",
        moment()
          .subtract(3, "months")
          .format(moment.HTML5_FMT.DATE)
      ),
      metaStore: db.collection("meta")
    };
  },
  computed: {
    meta: function() {
      // console.log(this.metaStore.find(d => d.active === true));
      return this.metaStore.length == 0
        ? {}
        : this.metaStore.find(d => d.active === true);
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
    passedContracts: function() {
      //return this.contractData.where("Status", "==", "Passed");
      return this.contractData.filter(a => a.status == "Passed");
    },
    waitingContracts: function() {
      //return this.contractData.where("Status", "==", "Waiting");
      return this.contractData.filter(a => a.status == "Waiting");
    },
    takenContracts: function() {
      //return this.contractData.where("Status", "==", "Taken");
      return this.contractData.filter(a => a.status == "Taken");
    }
  },
  methods: {
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
