<template>
  <o-table
    :selected="selected"
    :data="data"
    default-sort="status"
    focusable
    @update:selected="$emit('update:selected', selected)"
  >
    <template>
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
      >
        <template v-slot:header="{ column }">
          <b-tooltip
            label="Normalized Price includes closing cost fees and a unique algorithm around whether the contract is stripped or loaded. For every point remaining from the previous use year the contract price is reduced ($15). For every point used in the current or next use year the contract price is increased ($17/$19)."
            multilined
            is-large
            dashed
            animated
          >
            {{ column.label }}
          </b-tooltip>
        </template>
        <template v-slot="props">
          ${{ props.row.pricePerPointNormalized.toLocaleString("en") }}
        </template>
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
        {{ props.row.Notes }}
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
    </template>
  </o-table>
</template>

<script>
export default {
  props: ["data", "selected"],
  data() {
    return {};
  },
};
</script>
