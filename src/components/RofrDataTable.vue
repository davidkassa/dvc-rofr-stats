<template>
  <b-table
    :data="data"
    :columns="columns"
    :selected.sync="selectedRecord"
    @update:selected="changeSelected"
    default-sort="status"
    focusable
  >
    <template slot-scope="props" slot="header">
      <b-tooltip
        :active="!!props.column.meta"
        :label="props.column.meta"
        multilined
        is-large
        dashed
        animated
        >{{ props.column.label }}</b-tooltip>
    </template>
  </b-table>
</template>

<script>
export default {
  props: ["data", "selected"],
  methods: {
    changeSelected(record) {
      this.$emit("update:selected", record);
    }
  },
  data() {
    return {
      selectedRecord: {},
      columns: [
        {
          sortable: true,
          label: "Status",
          field: "status"
        },
        {
          sortable: true,
          label: "User",
          field: "user"
        },
        {
          sortable: true,
          numeric: true,
          label: "Price per Point",
          field: "pricePerPoint"
        },
        {
          sortable: true,
          numeric: true,
          label: "Price per Point (Normalized)",
          field: "pricePerPointNormalized",
          meta:
            "Normalized Price includes closing cost fees and a unique algorithm around whether the contract is stripped or loaded. For every point remaining from the previous use year the contract price is reduced ($15). For every point used in the current or next use year the contract price is increased ($17/$19)."
        },
        {
          sortable: true,
          numeric: true,
          label: "Price per Lifetime Point",
          field: "pricePerLifetimePoint"
        },
        {
          sortable: true,
          numeric: true,
          label: "Total Cost",
          field: "totalCost"
        },
        {
          sortable: true,
          numeric: true,
          label: "Points",
          field: "points"
        },
        {
          sortable: true,
          label: "Resort",
          field: "resort"
        },
        {
          sortable: true,
          label: "Use Year (UY)",
          field: "useYear"
        },
        {
          sortable: true,
          label: "Available Points",
          field: "availablePoints"
        },
        {
          sortable: true,
          label: "Notes",
          field: "notes"
        },
        {
          sortable: true,
          label: "Date Sent",
          field: "dateSent"
        },
        {
          sortable: true,
          label: "Date Resolved",
          field: "dateResolved"
        }
      ]
    };
  }
};
</script>
