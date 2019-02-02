<template>
  <b-table
    :data="data"
    :columns="columns"
    :selected.sync="selectedRecord"
    @update:selected="changeSelected"
    default-sort="status"
    focusable
  />
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
