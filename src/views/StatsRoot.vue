<template>
  <div class="data">
    <router-view
      :meta="meta"
      :selected="selected"
      :unfilteredContracts="contracts"
      :contracts="contractData"
      :waitingContracts="waitingContracts"
      :passedContracts="passedContracts"
      :takenContracts="takenContracts"
    />
    <div class="data-details">
      <div class="columns">
        <div class="column has-text-centered-mobile has-text-left-tablet">
          <rofr-dropdown
            :resorts="resortData"
            @statusFilterChanged="updateStatusFilter"
            @resortFilterChanged="updateResortFilter"
            @useYearFilterChanged="updateUseYearFilter"
          />
          <!-- pass data to child to disable values -->
          <!-- <rofr-dropdown :data=contractData /> -->
        </div>
        <div class="column has-text-centered-mobile has-text-right-tablet">
          <a
            v-show="Object.keys(meta).length !== 0"
            :href="meta.url"
            target="_blank"
            >{{ meta.text }} Last Updated: {{ meta.epoch | moment }}</a
          >
        </div>
      </div>
      <rofr-data-table :selected.sync="selected" :data="contractData" />
    </div>
  </div>
</template>

<script>
import RofrDataTable from "@/components/RofrDataTable.vue";
import RofrDropdown from "@/components/RofrDropdown.vue";
import { db } from "../firebase";
import * as moment from "moment";

export default {
  components: {
    RofrDataTable,
    RofrDropdown,
  },
  data() {
    return {
      selected: {},
      contracts: [],
      metaStore: [],
      statusFilter: [],
      resortFilter: [],
      useYearFilter: [],
      resortData: [
        {
          name: "Animal Kingdom (AKV)",
          value: "AKV",
          expirationYear: "2057",
        },
        {
          name: "Aulani (AUL)",
          value: "AUL",
          expirationYear: "2062",
        },
        {
          name: "Bay Lake Tower (BLT)",
          value: "BLT",
          expirationYear: "2060",
        },
        {
          name: "Beach Club (BCV)",
          value: "BCV",
          expirationYear: "2042",
        },
        {
          name: "Boardwalk (BWV)",
          value: "BWV",
          expirationYear: "2042",
        },
        {
          name: "Grand Californian (VGC)",
          value: "VGC",
          expirationYear: "2060",
        },
        {
          name: "Grand Floridian (VGF)",
          value: "VGF",
          expirationYear: "2064",
        },
        {
          name: "Hilton Head (HH)",
          value: "HH",
          expirationYear: "2042",
        },
        {
          name: "Old Key West (exp. 2042) (OKW)",
          value: "OKW",
          expirationYear: "2042",
        },
        {
          name: "Old Key West Extended (exp 2057) (OKW(E))",
          value: "OKW(E)",
          expirationYear: "2057",
        },
        {
          name: "Polynesian (PVB)",
          value: "PVB",
          expirationYear: "2066",
        },
        {
          name: "Riviera (RIV/DRR)",
          value: "RIV",
          expirationYear: "2069",
        },
        {
          name: "Saratoga Springs (SSR)",
          value: "SSR",
          expirationYear: "2054",
        },
        {
          name: "Vero Beach (VB)",
          value: "VB",
          expirationYear: "2042",
        },
        {
          name: "Wilderness Lodge: Boulder Ridge (BRV@WL)",
          value: "BRV@WL",
          expirationYear: "2042",
        },
        {
          name: "Wilderness Lodge: Copper Creek (CCV@WL)",
          value: "CCV@WL",
          expirationYear: "2068",
        },
      ],
    };
  },
  firestore() {
    return {
      contracts: db
        .collection("contracts")
        .where(
          "dateSent",
          ">=",
          moment().subtract(3, "months").format(moment.HTML5_FMT.DATE)
        ),
      metaStore: db.collection("meta"),
    };
  },
  computed: {
    meta: function () {
      // console.log(this.metaStore.find(d => d.active === true));
      return this.metaStore.length == 0
        ? {}
        : this.metaStore.find((d) => d.active === true);
    },
    contractData: function () {
      return this.contracts
        .map((c) => {
          // calculate lifetime points
          // Notice the points expire in JANUARY so if your use year
          // is February or a later month then your points actually expire the year before!
          let expirationYear = 2042; // lookupResortExpirationYear(c.resort);
          if (c.useYear !== "Jan") {
            expirationYear--;
          }
          let lastYear = 0;
          let thisYear = 0;
          let nextYear = 0;
          // add 2 years to get past next year - TODO is there additional UY logic here?
          let remainingYears = Math.max(
            0,
            c.points * (expirationYear - moment().add(2, "years").year())
          );
          let lifetimePrice =
            c.totalCost / (lastYear + thisYear + nextYear + remainingYears);

          // Normalized Points
          let availablePoints = c.availablePoints
            .split(",")
            .reduce((accum, year) => {
              try {
                let x = year.trim().split("/"); // points/year
                accum["20" + x[1].trim()] = x[0].trim();
              } catch {
                /* eat exception */
              }
              return accum;
            }, {});

          //calculate current year based on UY and dateSent
          let dateSent = moment(c.dateSent, moment.HTML5_FMT.DATE);
          let currentYear = dateSent.year();
          let currentMonth = dateSent.month();
          let uyMonth = moment(c.useYear, "MMM").month();
          if (uyMonth > currentMonth) {
            currentYear--;
          }

          let normalizedPriceTotal;
          let includeFees = true;
          if (includeFees) {
            normalizedPriceTotal = c.totalCost;
          } else {
            normalizedPriceTotal = c.points * c.pricePerPoint;
          }

          // expect last year to be spent, if not modify value ($15)
          let previousYearCost = 15;
          let expectedPreviousYearPoints = 0;
          let actualPreviousYearPoints = availablePoints[currentYear - 1] || 0;
          normalizedPriceTotal +=
            (expectedPreviousYearPoints - actualPreviousYearPoints) *
            previousYearCost;
          // expect this year to not be spent? value at $17
          let currentYearCost = 17;
          let expectedCurrentYearPoints = c.points;
          let actualCurrentYearPoints = availablePoints[currentYear] || 0;
          normalizedPriceTotal +=
            (expectedCurrentYearPoints - actualCurrentYearPoints) *
            currentYearCost;
          // expect next year to not be spent, if they are add value ($19 - disney rental price)
          let nextYearCost = 19;
          let expectedNextYearPoints = c.points;
          let actualNextYearPoints = availablePoints[currentYear + 1] || 0;
          normalizedPriceTotal +=
            (expectedNextYearPoints - actualNextYearPoints) * nextYearCost;

          let normalizedPrice = normalizedPriceTotal / c.points;

          // TODO - add dues

          return {
            pricePerPointNormalized: normalizedPrice.toFixed(2),
            pricePerLifetimePoint: lifetimePrice.toFixed(2),
            ...c,
          };
        })
        .filter(
          (a) =>
            this.statusFilter.length != 0 &&
            this.statusFilter.indexOf(a.status) !== -1
        )
        .filter(
          (a) =>
            this.resortFilter.length != 0 &&
            this.resortFilter.indexOf(a.resort) !== -1
        )
        .filter(
          (a) =>
            this.useYearFilter.length != 0 &&
            this.useYearFilter.indexOf(a.useYear) !== -1
        );
    },
    passedContracts: function () {
      //return this.contractData.where("Status", "==", "Passed");
      return this.contractData.filter((a) => a.status == "Passed");
    },
    waitingContracts: function () {
      //return this.contractData.where("Status", "==", "Waiting");
      return this.contractData.filter((a) => a.status == "Waiting");
    },
    takenContracts: function () {
      //return this.contractData.where("Status", "==", "Taken");
      return this.contractData.filter((a) => a.status == "Taken");
    },
  },
  methods: {
    updateStatusFilter: function (statusFilter) {
      //console.log("Status Filter Changed:\n" + JSON.stringify(statusFilter) + "\n");
      this.statusFilter = statusFilter;
    },
    updateResortFilter: function (resortFilter) {
      //console.log("Resort Filter Changed:\n" + JSON.stringify(resortFilter) + "\n");
      this.resortFilter = resortFilter;
    },
    updateUseYearFilter: function (useYearFilter) {
      //console.log("Use Year Filter Changed:\n" + JSON.stringify(useYearFilter) + "\n");
      this.useYearFilter = useYearFilter;
    },
  },
  filters: {
    moment: function (date) {
      return moment.unix(Number(date)).format("ddd, MMM D LT"); //.format('MMMM Do YYYY, h:mm:ss a');
    },
  },
};
</script>

<style scoped lang="scss">
.data-details {
  margin: 1%;
}
</style>
