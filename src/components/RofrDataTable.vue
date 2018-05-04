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
          field: "Status"
        },
        {
          label: "User",
          field: "User"
        },
        {
          label: "Price per Point",
          field: "PricePerPoint"
        },
        {
          label: "Total Cost",
          field: "TotalCost"
        },
        {
          label: "Points",
          field: "Points"
        },
        {
          label: "Resort",
          field: "Resort"
        },
        {
          label: "Use Year (UY)",
          field: "UseYear"
        },
        {
          label: "Available Points",
          field: "AvailablePoints"
        },
        {
          label: "Notes",
          field: "Notes"
        },
        {
          label: "Date Sent",
          field: "DateSent"
        },
        {
          label: "Date Resolved",
          field: "DateResolved"
        }
      ]
    };
  }
};
</script>
