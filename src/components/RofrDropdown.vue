<template>
<div>
    <vueMultiSelect
      @selectionChanged="updateValues"
      :options="options"
      :filters="filters"
      :selectOptions="data" />
</div>
</template>

<script>
import vueMultiSelect from "vue-multi-select";
import "vue-multi-select/dist/lib/vue-multi-select.min.css";
export default {
  props: {
    statusEventName: { type: String, default: "statusFilterChanged" },
    resortEventName: { type: String, default: "resortFilterChanged" },
    useYearEventName: { type: String, default: "useYearFilterChanged" }
  },
  data() {
    return {
      name: "",
      values: [],
      data: [
        {
          name: "Status",
          list: [
            {
              name: "Passed",
              value: "Passed",
              category: "Status",
              selected: true
            },
            {
              name: "Waiting",
              value: "Waiting",
              category: "Status",
              selected: true
            },
            {
              name: "Taken",
              value: "Taken",
              category: "Status",
              selected: true
            }
          ]
        },
        {
          name: "Resort",
          list: [
            {
              name: "Animal Kingdom (AKV)",
              value: "AKV",
              category: "Resort",
              selected: true
            },
            {
              name: "Aulani (AUL)",
              value: "AUL",
              category: "Resort",
              selected: true
            },
            {
              name: "Bay Lake Tower (BLT)",
              value: "BLT",
              category: "Resort",
              selected: true
            },
            {
              name: "Beach Club (BCV)",
              value: "BCV",
              category: "Resort",
              selected: true
            },
            {
              name: "Boardwalk (BWV)",
              value: "BWV",
              category: "Resort",
              selected: true
            },
            {
              name: "Grand Californian (VGC)",
              value: "VGC",
              category: "Resort",
              selected: true
            },
            {
              name: "Grand Floridian (VGF)",
              value: "VGF",
              category: "Resort",
              selected: true
            },
            {
              name: "Hilton Head (HH)",
              value: "HH",
              category: "Resort",
              selected: true
            },
            {
              name: "Old Key West (exp. 2042) (OKW)",
              value: "OKW",
              category: "Resort",
              selected: true
            },
            {
              name: "Old Key West Extended (exp 2057) (OKW(E))",
              value: "OKW(E)",
              category: "Resort",
              selected: true
            },
            {
              name: "Polynesian (PVB)",
              value: "PVB",
              category: "Resort",
              selected: true
            },
            {
              name: "Saratoga Springs (SSR)",
              value: "SSR",
              category: "Resort",
              selected: true
            },
            {
              name: "Vero Beach (VB)",
              value: "VB",
              category: "Resort",
              selected: true
            },
            {
              name: "Wilderness Lodge: Boulder Ridge (BRV@WL)",
              value: "BRV@WL",
              category: "Resort",
              selected: true
            },
            {
              name: "Wilderness Lodge: Copper Creek (CCV@WL)",
              value: "CCV@WL",
              category: "Resort",
              selected: true
            }
          ]
        },
        {
          name: "Use Year",
          list: [
            {
              name: "January",
              value: "Jan",
              category: "UseYear",
              selected: true
            },
            {
              name: "February",
              value: "Feb",
              category: "UseYear",
              selected: true
            },
            {
              name: "March",
              value: "Mar",
              category: "UseYear",
              selected: true
            },
            {
              name: "April",
              value: "Apr",
              category: "UseYear",
              selected: true
            },
            { name: "May", value: "May", category: "UseYear", selected: true },
            { name: "June", value: "Jun", category: "UseYear", selected: true },
            { name: "July", value: "Jul", category: "UseYear", selected: true },
            {
              name: "August",
              value: "Aug",
              category: "UseYear",
              selected: true
            },
            {
              name: "September",
              value: "Sep",
              category: "UseYear",
              selected: true
            },
            {
              name: "October",
              value: "Oct",
              category: "UseYear",
              selected: true
            },
            {
              name: "November",
              value: "Nov",
              category: "UseYear",
              selected: true
            },
            {
              name: "December",
              value: "Dec",
              category: "UseYear",
              selected: true
            }
          ]
        }
      ],
      filters: [
        // TODO - filter Resort on WDW, MK, Epcot, AK, D. Springs
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
        btnLabel: "Filter by Status, Resort, and UY",
        cssSelected: option =>
          option["selected"] ? { "font-weight": "bold" } : ""
      },
      selectedStatuses: [],
      selectedResorts: [],
      selectedUseYears: []
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
        this.values.filter(s => s.category == "Status")
      );
      this.updateSelectedResorts(
        this.values.filter(s => s.category == "Resort")
      );
      this.updateSelectedUseYears(
        this.values.filter(s => s.category == "UseYear")
      );
    },
    updateSelectedStatuses(statuses) {
      if (this.selectedStatuses.length != statuses.length) {
        this.selectedStatuses = statuses;
        this.$emit(
          this.statusEventName,
          this.selectedStatuses.map(s => s.value)
        );
      }
    },
    updateSelectedResorts(resorts) {
      if (this.selectedResorts.length != resorts.length) {
        this.selectedResorts = resorts;
        this.$emit(
          this.resortEventName,
          this.selectedResorts.map(s => s.value)
        );
      }
    },
    updateSelectedUseYears(useYears) {
      if (this.selectedUseYears.length != useYears.length) {
        this.selectedUseYears = useYears;
        this.$emit(
          this.useYearEventName,
          this.selectedUseYears.map(s => s.value)
        );
      }
    }
  },
  components: { vueMultiSelect }
};
</script>

<style scoped lang="scss">
.select:not(.is-multiple)::after {
  content: none;
}
</style>
<style lang="scss">
</style>
