<template>
  <div>
    <vueMultiSelect
      v-model="values"
      search
      :options="options"
      :filters="filters"
      :btn-label="btnLabel"
      :select-options="data"
      @selectionChanged="updateValues"
    />
  </div>
</template>

<script>
import vueMultiSelect from "vue-multi-select";
import "vue-multi-select/dist/lib/vue-multi-select.css";
export default {
  components: { vueMultiSelect },
  props: {
    resorts: { required: true },
    statusEventName: { type: String, default: "statusFilterChanged" },
    resortEventName: { type: String, default: "resortFilterChanged" },
    useYearEventName: { type: String, default: "useYearFilterChanged" },
  },
  data() {
    let listData = [
      {
        name: "Status",
        list: [
          {
            name: "Passed",
            value: "Passed",
            category: "Status",
          },
          {
            name: "Waiting",
            value: "Waiting",
            category: "Status",
          },
          {
            name: "Taken",
            value: "Taken",
            category: "Status",
          },
        ],
      },
      {
        name: "Resort",
        list: this.resorts.map((r) => {
          return { category: "Resort", ...r };
        }),
      },
      {
        name: "Use Year",
        list: [
          {
            name: "January",
            value: "Jan",
            category: "UseYear",
          },
          {
            name: "February",
            value: "Feb",
            category: "UseYear",
          },
          {
            name: "March",
            value: "Mar",
            category: "UseYear",
          },
          {
            name: "April",
            value: "Apr",
            category: "UseYear",
          },
          { name: "May", value: "May", category: "UseYear" },
          { name: "June", value: "Jun", category: "UseYear" },
          { name: "July", value: "Jul", category: "UseYear" },
          {
            name: "August",
            value: "Aug",
            category: "UseYear",
          },
          {
            name: "September",
            value: "Sep",
            category: "UseYear",
          },
          {
            name: "October",
            value: "Oct",
            category: "UseYear",
          },
          {
            name: "November",
            value: "Nov",
            category: "UseYear",
          },
          {
            name: "December",
            value: "Dec",
            category: "UseYear",
          },
        ],
      },
    ];
    return {
      btnLabel: (values) =>
        `Filter by Status, Resort, and UY (${values.length})`,
      name: "",
      values: listData.flatMap((d) => d.list),
      data: listData,
      filters: [
        // TODO - filter Resort on WDW, MK, Epcot, AK, D. Springs
        {
          nameAll: "Select All",
          nameNotAll: "Deselect All",
          func: () => {
            return true;
          },
        },
        // {
        //   nameAll: "select <= 10",
        //   nameNotAll: "Deselect <= 10",
        //   func: elem => {
        //     if (elem.name <= 10) {
        //       return true;
        //     }
        //     return false;
        //   }
        // },
        // {
        //   nameAll: "Select contains 2",
        //   nameNotAll: "Deselect contains 2",
        //   func: elem => {
        //     if (elem.name.indexOf("2") !== -1) {
        //       return true;
        //     }
        //     return false;
        //   }
        // }
      ],
      options: {
        multi: true,
        groups: true,
        cssSelected: (option) =>
          option["selected"] ? { "font-weight": "bold" } : "",
      },
      selectedStatuses: [],
      selectedResorts: [],
      selectedUseYears: [],
    };
  },
  computed: {
    // selectedStatuses: {
    //   get: function() {
    //     return this.values.filter(s => s.category == "Status" && s.selected);
    //   },
    //   set: function(statuses) {
    //   }
    // }
  },
  methods: {
    updateValues(values) {
      this.values = values;
      this.updateSelectedStatuses(
        this.values.filter((s) => s.category == "Status")
      );
      this.updateSelectedResorts(
        this.values.filter((s) => s.category == "Resort")
      );
      this.updateSelectedUseYears(
        this.values.filter((s) => s.category == "UseYear")
      );
    },
    updateSelectedStatuses(statuses) {
      if (this.selectedStatuses.length != statuses.length) {
        this.selectedStatuses = statuses;
        this.$emit(
          this.statusEventName,
          this.selectedStatuses.map((s) => s.value)
        );
      }
    },
    updateSelectedResorts(resorts) {
      if (this.selectedResorts.length != resorts.length) {
        this.selectedResorts = resorts;
        this.$emit(
          this.resortEventName,
          this.selectedResorts.map((s) => s.value)
        );
      }
    },
    updateSelectedUseYears(useYears) {
      if (this.selectedUseYears.length != useYears.length) {
        this.selectedUseYears = useYears;
        this.$emit(
          this.useYearEventName,
          this.selectedUseYears.map((s) => s.value)
        );
      }
    },
  },
};
</script>

<style scoped lang="scss">
.select:not(.is-multiple)::after,
.select:not(.is-multiple):not(.is-loading)::after,
.navbar-link::after {
  content: none;
}
</style>
<style lang="scss">
.select .checkBoxContainer {
  // does not work in Firefox
  overflow-y: overlay !important;
}
</style>
