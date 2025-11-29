<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";
use([CanvasRenderer, LineChart, TooltipComponent, GridComponent,LegendComponent]);

import moment from "moment";
import MA from "moving-average";
const DAY = 24 * 60 * 60 * 1000; //1 day

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
    option: function () {
      const passedColor = this.getColorFromCSS('--color-passed');
      const waitingColor = this.getColorFromCSS('--color-waiting');
      const takenColor = this.getColorFromCSS('--color-taken');

      return {
        backgroundColor: 'transparent',
        textStyle: {
          color: this.textColor,
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: this.isDarkMode ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: this.isDarkMode ? '#4a4a4a' : '#ccc',
          textStyle: {
            color: this.textColor,
          },
        },
        legend: {
          data: ["Passed", "Waiting", "Taken"],
          textStyle: {
            color: this.textColor,
          },
        },
        xAxis: {
          type: "time",
          axisLabel: {
            hideOverlap: true,
            color: this.textColor,
          },
          axisLine: {
            lineStyle: {
              color: this.isDarkMode ? '#4a4a4a' : '#e0e0e0',
            },
          },
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: false,
          axisLabel: {
            color: this.textColor,
          },
          axisLine: {
            lineStyle: {
              color: this.isDarkMode ? '#4a4a4a' : '#e0e0e0',
            },
          },
          splitLine: {
            show: false,
          },
          min: "dataMin",
          max: "dataMax",
        },
        series: [
          {
            name: "Passed",
            type: "line",
            lineStyle: { color: passedColor },
            itemStyle: { color: passedColor, borderColor: this.darkenColor(passedColor) },
            data: this.passedPricesPerPointByDate,
          },
          {
            name: "Waiting",
            type: "line",
            lineStyle: { color: waitingColor },
            itemStyle: { color: waitingColor, borderColor: this.darkenColor(waitingColor) },
            data: this.waitingPricesPerPointByDate,
          },
          {
            name: "Taken",
            type: "line",
            lineStyle: { color: takenColor },
            itemStyle: { color: takenColor, borderColor: this.darkenColor(takenColor) },
            data: this.takenPricesPerPointByDate,
          },
        ],
      };
    },
    passedPricesPerPointByDate: function () {
      return this.getPricesPerPointByDate(this.passed);
    },
    waitingPricesPerPointByDate: function () {
      return this.getPricesPerPointByDate(this.waiting);
    },
    takenPricesPerPointByDate: function () {
      return this.getPricesPerPointByDate(this.taken);
    },
  },
  methods: {
    getColorFromCSS(cssVariable) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(cssVariable)
        .trim();
    },
    darkenColor(color) {
      const hex = color.replace('#', '');
      const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
      const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
      const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    },
    getMovingAverageOfPricesPerPointByDate(status) {
      let prices = this.getPricesPerPointByDate(status);
      let movingAverage = [];
      let ma = MA(DAY);
      prices.map((p) => {
        ma.push(moment.utc(p.value[0]), p.value[1]);
        movingAverage.push({ value: [p.value[0], ma.movingAverage()] });
      });
      return movingAverage;
    },
    getPricesPerPointByDate(status) {
      let uniqueDates = [...new Set(status.map((s) => s.dateSent))];
      let pppByDate = uniqueDates
        .map((d) => {
          let singleDateStatus = status.filter((s) => s.dateSent == d);
          let sum = singleDateStatus.reduce(function (prevVal, elem) {
            return prevVal + elem.pricePerPoint;
          }, 0);
          let avg = sum / singleDateStatus.length;
          return { value: [d, avg] };
        })
        .sort((a, b) => {
          if (a.value[0] < b.value[0]) return -1;
          if (a.value[0] > b.value[0]) return 1;
          return 0;
        });

      return pppByDate;
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
  width: 400px;
}
</style>
