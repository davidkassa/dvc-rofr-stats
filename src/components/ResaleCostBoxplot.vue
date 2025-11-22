<template>
  <v-chart class="chart" :option="option"/>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BoxplotChart, ScatterChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
use([CanvasRenderer, BoxplotChart, GridComponent,TooltipComponent, ScatterChart]);

// Implement prepareBoxplotData function
function prepareBoxplotData(rawData) {
  const boxData = [];
  const outliers = [];

  rawData.forEach((dataItem, dataIndex) => {
    if (!dataItem || dataItem.length === 0) {
      boxData.push([0, 0, 0, 0, 0]);
      return;
    }

    const sorted = dataItem.slice().sort((a, b) => a - b);
    const len = sorted.length;

    const Q1 = sorted[Math.floor(len * 0.25)];
    const Q2 = sorted[Math.floor(len * 0.5)];
    const Q3 = sorted[Math.floor(len * 0.75)];
    const IQR = Q3 - Q1;
    const lowerBound = Q1 - 1.5 * IQR;
    const upperBound = Q3 + 1.5 * IQR;

    // Find min and max within bounds
    let min = sorted[0];
    let max = sorted[len - 1];

    for (let i = 0; i < len; i++) {
      if (sorted[i] >= lowerBound) {
        min = sorted[i];
        break;
      }
    }

    for (let i = len - 1; i >= 0; i--) {
      if (sorted[i] <= upperBound) {
        max = sorted[i];
        break;
      }
    }

    boxData.push([min, Q1, Q2, Q3, max]);

    // Collect outliers
    sorted.forEach(value => {
      if (value < lowerBound || value > upperBound) {
        outliers.push([dataIndex, value]);
      }
    });
  });

  return { boxData, outliers };
}

export default {
  components: {
    VChart,
  },
  props: ["waiting", "passed", "taken"],
  data() {
    return {};
  },
  computed: {
    isDarkMode() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    textColor() {
      return this.isDarkMode ? '#e0e0e0' : '#2c3e50';
    },
    preparedData: function () {
      return prepareBoxplotData([
        this.passedPricesPerPoint,
        this.waitingPricesPerPoint,
        this.takenPricesPerPoint,
      ]);
    },
    option: function () {
      return {
        backgroundColor: 'transparent',
        textStyle: {
          color: this.textColor,
        },
        xAxis: {
          data: ["Passed", "Waiting", "Taken"],
          axisLabel: {
            color: this.textColor,
          },
          axisLine: {
            lineStyle: {
              color: this.isDarkMode ? '#4a4a4a' : '#e0e0e0',
            },
          },
        },
        yAxis: {
          min: "dataMin",
          max: "dataMax",
          axisLabel: {
            color: this.textColor,
          },
          axisLine: {
            lineStyle: {
              color: this.isDarkMode ? '#4a4a4a' : '#e0e0e0',
            },
          },
          splitLine: {
            lineStyle: {
              color: this.isDarkMode ? '#4a4a4a' : '#e0e0e0',
            },
          },
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: this.isDarkMode ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: this.isDarkMode ? '#4a4a4a' : '#ccc',
          textStyle: {
            color: this.textColor,
          },
        },
        series: [
          {
            name: "boxplot",
            type: "boxplot",
            data: this.colorBoxData(
              this.preparedData == null ? null : this.preparedData.boxData
            ),
            tooltip: {
              formatter: function (param) {
                // console.log(param);
                return [
                  param.name,
                  "Upper: " + param.data.value[5],
                  "Q3: " + param.data.value[4],
                  "Median: " + param.data.value[3],
                  "Q1: " + param.data.value[2],
                  "Lower: " + param.data.value[1],
                ].join("<br/>");
              },
            },
          },
          {
            name: "Outlier",
            type: "scatter",
            data: this.colorOutliers(
              this.preparedData == null ? null : this.preparedData.outliers
            ),
          },
        ],
      };
    },
    passedPricesPerPoint: function () {
      return this.passed.map((p) => p.pricePerPoint);
    },
    waitingPricesPerPoint: function () {
      return this.waiting.map((w) => w.pricePerPoint);
    },
    takenPricesPerPoint: function () {
      return this.taken.map((t) => t.pricePerPoint);
    },
  },
  methods: {
    colorBoxData(boxData) {
      if (boxData == null) return null;
      return boxData.map((d, i) => ({
        value: d,
        itemStyle: this.colorData(i),
      }));
    },
    colorOutliers(outliers) {
      if (outliers == null) return null;
      return outliers.map((o) => ({
        value: o,
        itemStyle: this.colorData(o[0]),
      }));
    },
    getColorFromCSS(cssVariable) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(cssVariable)
        .trim();
    },
    darkenColor(color) {
      // Simple darkening by reducing RGB values
      const hex = color.replace('#', '');
      const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
      const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
      const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    },
    colorData(status) {
      let color, borderColor;
      switch (status) {
        case 0:
          color = this.getColorFromCSS('--color-passed');
          borderColor = this.darkenColor(color);
          break;
        case 1:
          color = this.getColorFromCSS('--color-waiting');
          borderColor = this.darkenColor(color);
          break;
        case 2:
          color = this.getColorFromCSS('--color-taken');
          borderColor = this.darkenColor(color);
          break;
      }
      return {
        color: color,
        color0: color,
        borderColor: borderColor,
        borderColor0: borderColor,
      };
    },
  },
};
// option = {
//     xAxis: {
//         data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27']
//     },
//     yAxis: {},
//     series: [{
//         type: 'k',
//         data: [
//             [20, 30, 10, 35],
//             [40, 35, 30, 55],
//             [33, 38, 33, 40],
//             [40, 40, 32, 42]
//         ]
//     }]
// };
</script>

<style lang="scss" scoped>
.chart {
  height: 400px;
}
</style>
