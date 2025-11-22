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
  methods: {
    getColorFromCSS(cssVariable) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(cssVariable)
        .trim();
    },
  },
  computed: {
    isDarkMode() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    textColor() {
      return this.isDarkMode ? '#e0e0e0' : '#2c3e50';
    },
    option: function () {
      return {
        backgroundColor: 'transparent',
        textStyle: {
          color: this.textColor,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
          backgroundColor: this.isDarkMode ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: this.isDarkMode ? '#4a4a4a' : '#ccc',
          textStyle: {
            color: this.textColor,
          },
        },
        legend: {
          bottom: "0px",
          padding: 5,
          data: ["Passed", "Waiting", "Taken"],
          textStyle: {
            color: this.textColor,
          },
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
              color: this.textColor,
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
              lineStyle: {
                color: this.isDarkMode ? '#4a4a4a' : '#999',
              },
            },
            data: [
              {
                value: this.waiting,
                name: "Waiting",
                itemStyle: { color: this.getColorFromCSS('--color-waiting') },
                selected: false,
              },
              {
                value: this.passed,
                name: "Passed",
                itemStyle: { color: this.getColorFromCSS('--color-passed') },
                selected: true,
              },
              {
                value: this.taken,
                name: "Taken",
                itemStyle: { color: this.getColorFromCSS('--color-taken') },
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
