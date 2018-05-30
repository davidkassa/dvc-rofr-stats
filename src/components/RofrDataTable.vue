<template>
  <b-table :data=data :columns=columns />
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      columns: [
        {
          label: "Status",
          field: "status"
        },
        {
          label: "User",
          field: "user"
        },
        {
          label: "Price per Point",
          field: "pricePerPoint"
        },
        {
          label: "Total Cost",
          field: "totalCost"
        },
        {
          label: "Points",
          field: "points"
        },
        {
          label: "Resort",
          field: "resort"
        },
        {
          label: "Use Year (UY)",
          field: "useYear"
        },
        {
          label: "Available Points",
          field: "availablePoints"
        },
        {
          label: "Notes",
          field: "notes"
        },
        {
          label: "Date Sent",
          field: "dateSent"
        },
        {
          label: "Date Resolved",
          field: "dateResolved"
        }
      ]
    };
  }
};
</script>
