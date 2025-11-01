<template>
  <o-table
    :data="data"
    v-model:selected="localSelected"
    :striped="true"
    :hoverable="true"
    :mobile-cards="false"
    selectable
  >
    <o-table-column field="status" label="Status" sortable v-slot="props">
      {{ props.row.status }}
    </o-table-column>

    <o-table-column field="user" label="User" sortable v-slot="props">
      {{ props.row.user }}
    </o-table-column>

    <o-table-column
      field="pricePerPoint"
      label="Price per Point"
      numeric
      sortable
      v-slot="props"
    >
      ${{ props.row.pricePerPoint.toLocaleString("en") }}
    </o-table-column>

    <o-table-column
      field="pricePerPointNormalized"
      label="Price per Point (Normalized)"
      numeric
      sortable
      v-slot="props"
    >
      ${{ props.row.pricePerPointNormalized.toLocaleString("en") }}
    </o-table-column>

    <o-table-column
      field="pricePerLifetimePoint"
      label="Price per Lifetime Point"
      numeric
      sortable
      v-slot="props"
    >
      ${{ props.row.pricePerLifetimePoint.toLocaleString("en") }}
    </o-table-column>

    <o-table-column
      field="totalCost"
      label="Total Cost"
      numeric
      sortable
      v-slot="props"
    >
      ${{ props.row.totalCost.toLocaleString("en") }}
    </o-table-column>

    <o-table-column
      field="points"
      label="Points"
      numeric
      sortable
      v-slot="props"
    >
      {{ props.row.points.toLocaleString("en") }}
    </o-table-column>

    <o-table-column field="resort" label="Resort" sortable v-slot="props">
      {{ props.row.resort }}
    </o-table-column>

    <o-table-column
      field="useYear"
      label="Use Year (UY)"
      sortable
      v-slot="props"
    >
      {{ props.row.useYear }}
    </o-table-column>

    <o-table-column
      field="availablePoints"
      label="Available Points"
      sortable
      v-slot="props"
    >
      {{ props.row.availablePoints }}
    </o-table-column>

    <o-table-column field="notes" label="Notes" sortable v-slot="props">
      {{ props.row.notes }}
    </o-table-column>

    <o-table-column
      field="dateSent"
      label="Date Sent"
      sortable
      v-slot="props"
    >
      {{ props.row.dateSent }}
    </o-table-column>

    <o-table-column
      field="dateResolved"
      label="Date Resolved"
      sortable
      v-slot="props"
    >
      {{ props.row.dateResolved }}
    </o-table-column>
  </o-table>
</template>

<script>
export default {
  props: ["data", "selected"],
  computed: {
    localSelected: {
      get() {
        return this.selected;
      },
      set(value) {
        this.$emit("update:selected", value);
      },
    },
  },
};
</script>

<style>
/* Highlight selected table row */
.o-table__tr--selected {
  background-color: #61c661 !important;
  color: white !important;
}

.o-table__tr--selected:hover {
  background-color: #4db34d !important;
}
</style>
