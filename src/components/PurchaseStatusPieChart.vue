<template>
  <chart class="chart" :option="option"></chart>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import ECharts from "vue-echarts";
use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

export default {
  components: {
    chart: ECharts,
  },
  mounted() {},
  props: ["waiting", "passed", "taken"],
  data() {
    return {};
  },
  computed: {
    option: function () {
      return {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          bottom: "0px",
          padding: 5,
          data: ["Passed", "Waiting", "Taken"],
        },
        series: [
          {
            type: "pie",
            avoidLabelOverlap: true,
            name: "series",
            data: [
              {
                value: this.waiting,
                name: "Waiting",
                itemStyle: { color: "#F8B379" },
                selected: false,
              },
              {
                value: this.passed,
                name: "Passed",
                itemStyle: { color: "#61C661" },
                selected: true,
              },
              {
                value: this.taken,
                name: "Taken",
                itemStyle: { color: "#f87979" },
                selected: true,
              },
            ],
          },
        ],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 350px;
}
</style>
