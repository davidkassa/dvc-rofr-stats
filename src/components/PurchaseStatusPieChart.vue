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
        grid: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 50,
          containLabel: true,
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["50%", "45%"],
            avoidLabelOverlap: true,
            name: "series",
            label: {
              show: true,
              position: "outer",
              alignTo: "labelLine",
              bleedMargin: 5,
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
            },
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
