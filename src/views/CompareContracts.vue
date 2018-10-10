<template>
  <div class="data-details">
    <p v-show="Object.keys(selected).length === 0">
      Select your contract from the table below to see how it compares to others.<br />
      Don't see your contract? Add it to the current <a :href="Object.keys(meta).length === 0 ? 'https://www.disboards.com/forums/purchasing-dvc.28/' : meta.url" target="_blank">DISBoard thread</a>.
    </p>
    <b-table v-show="Object.keys(selected).length !== 0">
    </b-table>
    <b-table
        :data="isEmpty ? [] : data"
        :bordered="isBordered"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :hoverable="isHoverable"
        :loading="isLoading"
        :focusable="isFocusable"
        :mobile-cards="hasMobileCards">

        <template slot-scope="props">
            <b-table-column field="id" label="ID" width="40" numeric>
                {{ props.row.id }}
            </b-table-column>

            <b-table-column field="first_name" label="First Name">
                {{ props.row.first_name }}
            </b-table-column>

            <b-table-column field="last_name" label="Last Name">
                {{ props.row.last_name }}
            </b-table-column>

            <b-table-column field="date" label="Date" centered>
                <span class="tag is-success">
                    {{ new Date(props.row.date).toLocaleDateString() }}
                </span>
            </b-table-column>

            <b-table-column label="Gender">
                <b-icon pack="fas"
                    :icon="props.row.gender === 'Male' ? 'mars' : 'venus'">
                </b-icon>
                {{ props.row.gender }}
            </b-table-column>
        </template>

        <template slot="empty">
            <section class="section">
                <div class="content has-text-grey has-text-centered">
                    <p>
                        <b-icon
                            icon="emoticon-sad"
                            size="is-large">
                        </b-icon>
                    </p>
                    <p>Nothing here.</p>
                </div>
            </section>
        </template>
    </b-table>



    {{ selected }}
  </div>
</template>

<script>
// import RofrDataTable from "@/components/RofrDataTable.vue";
// import RofrDropdown from "@/components/RofrDropdown.vue";
// import { db } from "../main";
// import * as moment from "moment";

export default {
  // components: {
  //   RofrDataTable,
  //   RofrDropdown
  // },
  props: ["meta", "selected", "contracts"],
  data() {
    return {
      // metaStore: []
    };
  },
  computed: {},
  methods: {
    // updateStatusFilter: function(statusFilter) {
    //   //console.log("Status Filter Changed:\n" + JSON.stringify(statusFilter) + "\n");
    //   this.statusFilter = statusFilter;
    // },
  },
  filters: {
    // moment: function(date) {
    //   return moment.unix(Number(date)).format("ddd, MMM D LT"); //.format('MMMM Do YYYY, h:mm:ss a');
    // }
  }
};
</script>

<style scoped lang="scss">
.data-details {
  margin: 1%;
}
</style>
