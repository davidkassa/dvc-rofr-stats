<template>
  <b-table :data=data :columns=columns default-sort="status" />
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
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
