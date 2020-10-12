<template>
  <b-table
    :selected.sync="selected"
    :data="data"
    default-sort="status"
    focusable
    @update:selected="$emit('update:selected', selected)"
  >
    <template #header="props">
      <b-tooltip
        :active="!!props.column.meta"
        :label="props.column.meta || ''"
        multilined
        is-large
        dashed
        animated
      >
        {{ props.column.label }}
      </b-tooltip>
    </template>
    <template>
      <b-table-column field="status" label="Status" sortable v-slot="props">
        {{ props.row.status }}
      </b-table-column>
      <b-table-column field="user" label="User" sortable v-slot="props">
        {{ props.row.user }}
      </b-table-column>
      <b-table-column
        field="pricePerPoint"
        label="Price per Point"
        numeric
        sortable
        v-slot="props"
      >
        ${{ props.row.pricePerPoint.toLocaleString("en") }}
      </b-table-column>
      <b-table-column
        field="pricePerPointNormalized"
        label="Price per Point (Normalized)"
        meta="Normalized Price includes closing cost fees and a unique algorithm around whether the contract is stripped or loaded. For every point remaining from the previous use year the contract price is reduced ($15). For every point used in the current or next use year the contract price is increased ($17/$19)."
        numeric
        sortable
        v-slot="props"
      >
        ${{ props.row.pricePerPointNormalized.toLocaleString("en") }}
      </b-table-column>
      <b-table-column
        field="pricePerLifetimePoint"
        label="Price per Lifetime Point"
        numeric
        sortable
        v-slot="props"
      >
        ${{ props.row.pricePerLifetimePoint.toLocaleString("en") }}
      </b-table-column>
      <b-table-column
        field="totlaCost"
        label="Total Cost"
        numeric
        sortable
        v-slot="props"
      >
        ${{ props.row.totalCost.toLocaleString("en") }}
      </b-table-column>
      <b-table-column
        field="points"
        label="Points"
        numeric
        sortable
        v-slot="props"
      >
        {{ props.row.points.toLocaleString("en") }}
      </b-table-column>
      <b-table-column field="resort" label="Resort" sortable v-slot="props">
        {{ props.row.resort }}
      </b-table-column>
      <b-table-column
        field="useYear"
        label="Use Year (UY)"
        sortable
        v-slot="props"
      >
        {{ props.row.useYear }}
      </b-table-column>
      <b-table-column
        field="availablePoints"
        label="Available Points"
        sortable
        v-slot="props"
      >
        ${{ props.row.availablePoints }}
      </b-table-column>
      <b-table-column field="notes" label="Notes" sortable v-slot="props">
        {{ props.row.Notes }}
      </b-table-column>
      <b-table-column
        field="dateSent"
        label="Date Sent"
        sortable
        v-slot="props"
      >
        {{ props.row.dateSent }}
      </b-table-column>
      <b-table-column
        field="dateResolved"
        label="Date Resolved"
        sortable
        v-slot="props"
      >
        {{ props.row.dateResolved }}
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
export default {
  props: ["data", "selected"],
  data() {
    return {};
  },
};
</script>
