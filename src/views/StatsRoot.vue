<template>
  <div class="data">
    <router-view
      :meta="meta"
      :selected="selected"
      :unfiltered-contracts="contracts"
      :contracts="contractData"
      :waiting-contracts="waitingContracts"
      :passed-contracts="passedContracts"
      :taken-contracts="takenContracts"
    />
    <div class="data-details">
      <div class="columns">
        <div class="column has-text-centered-mobile has-text-left-tablet">
          <rofr-dropdown
            class="is-pulled-left mr-1"
            :resorts="resortData"
            @statusFilterChanged="updateStatusFilter"
            @resortFilterChanged="updateResortFilter"
            @useYearFilterChanged="updateUseYearFilter"
          />
          <download-csv
            class="is-pulled-left"
            :data="contractData"
            :fields="csvFields"
            :labels="csvLabels"
            name="DVC_Stats.csv"
          >
            <b-button icon-left="file-excel" size="is-small">
              Download Data
            </b-button>
          </download-csv>
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
import moment from "moment";

export default {
  components: {
    RofrDataTable,
    RofrDropdown,
  },
  filters: {
    moment: function (date) {
      return moment.unix(Number(date)).format("ddd, MMM D LT"); //.format('MMMM Do YYYY, h:mm:ss a');
    },
  },
  data() {
    return {
      selected: {},
      contracts: [],
      metaStore: [],
      statusFilter: [],
      resortFilter: [],
      useYearFilter: [],
      csvFields: [
        "status",
        "user",
        "pricePerPoint",
        "pricePerPointNormalized",
        "pricePerLifetimePoint",
        "totalCost",
        "points",
        "resort",
        "useYear",
        "availablePoints",
        "notes",
        "dateSent",
        "dateResolved",
      ],
      csvLabels: {
        status: "Status",
        user: "User",
        pricePerPoint: "Price per Point",
        pricePerPointNormalized: "Price per Point (Normalized)",
        pricePerLifetimePoint: "Price per Lifetime Point",
        totalCost: "Total Cost",
        points: "Points",
        resort: "Resort",
        useYear: "Use Year (UY)",
        availablePoints: "Available Points",
        notes: "Notes",
        dateSent: "Date Sent",
        dateResolved: "Date Resolved",
      },
      resortData: [
        {
          name: "Animal Kingdom (AKV)",
          value: "AKV",
          expirationYear: "2057",
          dues: "8.07",
        },
        {
          name: "Aulani (AUL)",
          value: "AUL",
          expirationYear: "2062",
          dues: "8.35",
          duesSubsidized: "6.28",
        },
        {
          name: "Bay Lake Tower (BLT)",
          value: "BLT",
          expirationYear: "2060",
          dues: "6.90",
        },
        {
          name: "Beach Club (BCV)",
          value: "BCV",
          expirationYear: "2042",
          dues: "7.44",
        },
        {
          name: "Boardwalk (BWV)",
          value: "BWV",
          expirationYear: "2042",
          dues: "7.81",
        },
        {
          name: "Grand Californian (VGC)",
          value: "VGC",
          expirationYear: "2060",
          dues: "6.99",
        },
        {
          name: "Grand Floridian (VGF)",
          value: "VGF",
          expirationYear: "2064",
          dues: "6.81",
        },
        {
          name: "Hilton Head (HH)",
          value: "HH",
          expirationYear: "2042",
          dues: "9.97",
        },
        {
          name: "Old Key West (exp. 2042) (OKW)",
          value: "OKW",
          expirationYear: "2042",
          dues: "8.36",
        },
        {
          name: "Old Key West Extended (exp 2057) (OKW(E))",
          value: "OKW(E)",
          expirationYear: "2057",
          dues: "8.36",
        },
        {
          name: "Polynesian (PVB)",
          value: "PVB",
          expirationYear: "2066",
          dues: "7.05",
        },
        {
          name: "Riviera (RIV/DRR)",
          value: "RIV",
          expirationYear: "2069",
          dues: "8.38",
        },
        {
          name: "Saratoga Springs (SSR)",
          value: "SSR",
          expirationYear: "2054",
          dues: "7.11",
        },
        {
          name: "Vero Beach (VB)",
          value: "VB",
          expirationYear: "2042",
          dues: "11.23",
          duesSubsidized: "8.86",
        },
        {
          name: "Wilderness Lodge: Boulder Ridge (BRV@WL)",
          value: "BRV@WL",
          expirationYear: "2042",
          dues: "8.11",
        },
        {
          name: "Wilderness Lodge: Copper Creek (CCV@WL)",
          value: "CCV@WL",
          expirationYear: "2068",
          dues: "7.59",
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
          // Get points from previous, current, and next year
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

          let previousYearPoints = parseInt(
            availablePoints[currentYear - 1] || 0
          );
          let currentYearPoints = parseInt(availablePoints[currentYear] || 0);
          let nextYearPoints = parseInt(availablePoints[currentYear + 1] || 0);
          // console.log(`prev: ${previousYearPoints} current ${currentYearPoints} next ${nextYearPoints}`);

          // calculate lifetime points
          // Notice the points expire in JANUARY so if your use year
          // is February or a later month then your points actually expire the year before!

          // Lets look at OKW - 100 point contract expires 2042. Today is Feb 15, 2021 so what does that mean?
          // Jan UY vs Mar UY

          // Jan UY means I have points from Jan 1, 2042 to Dec 31, 2042
          // Mar UY means I have points from Mar 1, 2041 to Feb 29, 2042
          // All points are done on Dec 31, 2042

          // Today is 2021 UY for Jan contract, previous year was 2020, next year 2022
          // Today is 2020 UY for Mar contract, previous year was 2019, next year 2021

          // Jan has 2021, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, and 42 = 2200 points
          // Mar has 2020, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, and 42 = 2300 points

          // Jan: expYear - currentYear = 2042 - 2021 = 21 years, need to add 1
          // Mar: expYear - currentYear = 2042 - 2020 = 22 years, need to add 1

          let expirationYear = this.lookupResortExpirationYear(c.resort);
          // Not needed based on logic above
          // if (c.useYear !== "Jan") {
          //   expirationYear--;
          // }

          // add 2 years to get past next year
          let remainingYears = Math.max(
            0,
            c.points * (expirationYear - currentYear + 1 - 2) // add 1 for inclusive year (see above) and remove 2 as those years are  calculated explicitly (below)
          );
          // console.log(`remaining: ${remainingYears} total cost: ${c.totalCost} points: ${c.points}`);
          let lifetimePrice =
            c.totalCost /
            (previousYearPoints +
              currentYearPoints +
              nextYearPoints +
              remainingYears);
          // console.log(`lifetime price: ${lifetimePrice}`);
          // console.log("sum: " + (previousYearPoints + currentYearPoints + nextYearPoints + remainingYears))
          // console.log("recalculate: " + c.totalCost / (previousYearPoints + currentYearPoints + nextYearPoints + remainingYears))

          // Normalized Points
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
          normalizedPriceTotal +=
            (expectedPreviousYearPoints - previousYearPoints) *
            previousYearCost;
          // expect this year to not be spent? value at $17
          let currentYearCost = 17;
          let expectedCurrentYearPoints = c.points;
          normalizedPriceTotal +=
            (expectedCurrentYearPoints - currentYearPoints) * currentYearCost;
          // expect next year to not be spent, if they are add value ($19 - disney rental price)
          let nextYearCost = 19;
          let expectedNextYearPoints = c.points;
          normalizedPriceTotal +=
            (expectedNextYearPoints - nextYearPoints) * nextYearCost;

          let normalizedPrice = normalizedPriceTotal / c.points;

          // TODO - add dues
          // from https://www.dvcresalemarket.com/buying/annual-dues/ seeded dues are 2021
          // CAGR average is 3.75%

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
    lookupResortExpirationYear: function (resort) {
      return parseInt(
        this.resortData.find((r) => r.value == resort)?.expirationYear || 0
      );
    },
  },
};
</script>

<style scoped lang="scss">
.data-details {
  margin: 1%;
}
</style>
