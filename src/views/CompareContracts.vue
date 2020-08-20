<template>
  <div class="data-details">
    <b-table :data="data" :mobile-cards="true">
      <template #default="props">
        <b-table-column label="">
          <b>{{ props.row.name }}</b>
        </b-table-column>

        <b-table-column label="Selected Contract">
          {{ props.row.selected }}
        </b-table-column>

        <b-table-column label="All Contracts">
          {{ props.row.all }}
        </b-table-column>

        <b-table-column label="Same Resort">
          {{ props.row.resort }}
        </b-table-column>

        <b-table-column label="Same UY"> {{ props.row.uy }} </b-table-column>
      </template>

      <template #empty>
        <section class="section">
          <div class="has-text-centered">
            <p>
              Select your contract from the table below to see how it compares
              to others.<br />
              Don't see your contract? Add it to the current
              <a
                :href="
                  Object.keys(meta).length === 0
                    ? 'https://www.disboards.com/forums/purchasing-dvc.28/'
                    : meta.url
                "
                target="_blank"
                >DISBoard thread</a
              >.
            </p>
          </div>
        </section>
      </template>
    </b-table>
    <!-- {{ selected }} -->
  </div>
</template>

<script>
import aggregate from "@/util/aggregate";

export default {
  filters: {
    // moment: function(date) {
    //   return moment.unix(Number(date)).format("ddd, MMM D LT"); //.format('MMMM Do YYYY, h:mm:ss a');
    // }
  },
  mixins: [aggregate],
  // components: {
  //   RofrDataTable,
  //   RofrDropdown
  // },
  props: ["meta", "selected", "unfilteredContracts"],
  data() {
    return {
      // metaStore: []
    };
  },
  computed: {
    all: function () {
      return this.unfilteredContracts;
    },
    resort: function () {
      if (Object.keys(this.selected).length === 0) return [];
      return this.all.filter((a) => a.resort === this.selected.resort);
    },
    uy: function () {
      if (Object.keys(this.selected).length === 0) return [];
      return this.resort.filter((a) => a.useYear === this.selected.useYear);
    },
    data: function () {
      if (Object.keys(this.selected).length === 0) return [];
      return [
        {
          name: "# of Contracts",
          selected: "- " + [this.selected].length + " -",
          all: this.all.length,
          resort: this.resort.length,
          uy: this.uy.length,
        },
        {
          name: "Average Points per Contract",
          selected: this.getAveragePoints([this.selected]),
          all: this.getAveragePoints(this.all),
          resort: this.getAveragePoints(this.resort),
          uy: this.getAveragePoints(this.uy),
        },
        {
          name: "Average Price per Point",
          selected: this.getAveragePricePerPoint([this.selected]),
          all: this.getAveragePricePerPoint(this.all),
          resort: this.getAveragePricePerPoint(this.resort),
          uy: this.getAveragePricePerPoint(this.uy),
        },
        {
          name: "Average Total Cost",
          selected: this.getAverageTotalCost([this.selected]),
          all: this.getAverageTotalCost(this.all),
          resort: this.getAverageTotalCost(this.resort),
          uy: this.getAverageTotalCost(this.uy),
        },
        {
          name: "# of Days Waiting",
          selected: this.getWaitTimeForStatus([this.selected], "Waiting"),
          all: this.getWaitTimeForStatus(this.all, "Waiting"),
          resort: this.getWaitTimeForStatus(this.resort, "Waiting"),
          uy: this.getWaitTimeForStatus(this.uy, "Waiting"),
        },
        {
          name: "# of Days until Passed",
          selected: this.getWaitTimeForStatus([this.selected], "Passed"),
          all: this.getWaitTimeForStatus(this.all, "Passed"),
          resort: this.getWaitTimeForStatus(this.resort, "Passed"),
          uy: this.getWaitTimeForStatus(this.uy, "Passed"),
        },
        {
          name: "# of Days until Taken",
          selected: this.getWaitTimeForStatus([this.selected], "Taken"),
          all: this.getWaitTimeForStatus(this.all, "Taken"),
          resort: this.getWaitTimeForStatus(this.resort, "Taken"),
          uy: this.getWaitTimeForStatus(this.uy, "Taken"),
        },
      ];
    },
  },
  methods: {
    getWaitTimeForStatus(contracts, status) {
      var filtered = contracts.filter((a) => a.status == status);
      if (filtered.length < 1) return "---";
      return this.getAverageWaitTime(filtered);
    },
    // updateStatusFilter: function(statusFilter) {
    //   //console.log("Status Filter Changed:\n" + JSON.stringify(statusFilter) + "\n");
    //   this.statusFilter = statusFilter;
    // },
  },
};
</script>

<style scoped lang="scss">
.data-details {
  margin: 1%;
}
</style>
