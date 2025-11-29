<template>
  <o-table
    :data="data"
    v-model:selected="localSelected"
    :striped="true"
    :hoverable="true"
    :mobile-cards="true"
    :default-sort="['dateResolved', 'desc']"
    selectable
  >
    <o-table-column field="status" label="Status" sortable>
      <template v-slot="props">
        {{ props.row.status }}
      </template>
    </o-table-column>

    <o-table-column field="user" label="User" sortable>
      <template v-slot="props">
        {{ props.row.user }}
      </template>
    </o-table-column>

    <o-table-column
      field="pricePerPoint"
      label="Price per Point"
      numeric
      sortable
    >
      <template v-slot="props">
        ${{ props.row.pricePerPoint.toLocaleString("en") }}
      </template>
    </o-table-column>

    <o-table-column
      field="pricePerPointNormalized"
      label="Price per Point (Normalized)"
      numeric
      sortable
    >
      <template v-slot="props">
        ${{ props.row.pricePerPointNormalized.toLocaleString("en") }}
      </template>
    </o-table-column>

    <o-table-column
      field="pricePerLifetimePoint"
      label="Price per Lifetime Point"
      numeric
      sortable
    >
      <template v-slot="props">
        ${{ props.row.pricePerLifetimePoint.toLocaleString("en") }}
      </template>
    </o-table-column>

    <o-table-column
      field="totalCost"
      label="Total Cost"
      numeric
      sortable
    >
      <template v-slot="props">
        ${{ props.row.totalCost.toLocaleString("en") }}
      </template>
    </o-table-column>

    <o-table-column
      field="points"
      label="Points"
      numeric
      sortable
    >
      <template v-slot="props">
        {{ props.row.points.toLocaleString("en") }}
      </template>
    </o-table-column>

    <o-table-column field="resort" label="Resort" sortable>
      <template v-slot="props">
        {{ props.row.resort }}
      </template>
    </o-table-column>

    <o-table-column
      field="useYear"
      label="Use Year (UY)"
      sortable
    >
      <template v-slot="props">
        {{ props.row.useYear }}
      </template>
    </o-table-column>

    <o-table-column
      field="availablePoints"
      label="Available Points"
      sortable
    >
      <template v-slot="props">
        {{ props.row.availablePoints }}
      </template>
    </o-table-column>

    <o-table-column field="notes" label="Notes" sortable>
      <template v-slot="props">
        {{ props.row.notes }}
      </template>
    </o-table-column>

    <o-table-column
      field="dateSent"
      label="Date Sent"
      sortable
    >
      <template v-slot="props">
        {{ props.row.dateSent }}
      </template>
    </o-table-column>

    <o-table-column
      field="dateResolved"
      label="Date Resolved"
      sortable
    >
      <template v-slot="props">
        {{ props.row.dateResolved }}
      </template>
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
/* Component-specific overrides if needed */
</style>
