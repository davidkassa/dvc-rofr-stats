<template>
  <chart class="chart" :option="option"></chart>
</template>

<script>
import {use} from "echarts/core"
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts"
import { TooltipComponent, GridComponent  } from "echarts/components"
import ECharts from "vue-echarts";
use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  GridComponent 
]);

import * as moment from "moment";
import MA from "moving-average";
const DAY = 24 * 60 * 60 * 1000; //1 day

export default {
  components: {
    chart: ECharts,
  },
  props: ["waiting", "passed", "taken"],
  data() {
    return {};
  },
  computed: {
    option: function () {
      return {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [
            "Passed",
            // "Waiting",
            "Taken",
          ],
        },
        xAxis: {
          type: "time",
          axisLabel: {
            hideOverlap: true
          },
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: false,
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
            lineStyle: { color: "#61c661" },
            itemStyle: { color: "#61c661", borderColor: "#3CAA3C" },
            data: this.passedWaitTimeByDate,
          },
          // {
          //   name: "Waiting",
          //   type: "line",
          //   lineStyle: { color: "#f8b379" },
          //   itemStyle: { color: "#f8b379", borderColor: "#D4894B" },
          //   data: this.waitingWaitTimeByDate
          // },
          {
            name: "Taken",
            type: "line",
            lineStyle: { color: "#f87979" },
            itemStyle: { color: "#f87979", borderColor: "#D44B4B" },
            data: this.takenWaitTimeByDate,
          },
        ],
      };
    },
    passedWaitTimeByDate: function () {
      return this.getWaitTimeByDate(this.passed);
    },
    // waitingWaitTimeByDate: function() {
    //   return this.getWaitTimeByDate(this.waiting);
    // },
    takenWaitTimeByDate: function () {
      return this.getWaitTimeByDate(this.taken);
    },
  },
  methods: {
    getMovingAverageOfWaitTimeByDate(status) {
      let prices = this.getWaitTimeByDate(status);
      let movingAverage = [];
      let ma = MA(DAY);
      prices.map((p) => {
        ma.push(moment.utc(p.value[0]), p.value[1]);
        movingAverage.push({ value: [p.value[0], ma.movingAverage()] });
      });
      return movingAverage;
    },
    getWaitTimeByDate(status) {
      let uniqueDates = [...new Set(status.map((s) => s.dateSent))];
      let waitTimeByDate = uniqueDates
        .map((d) => {
          let singleDateStatus = status.filter((s) => s.dateSent == d);
          let sum = singleDateStatus.reduce(function (prevVal, elem) {
            let resolved = moment(elem.dateResolved, moment.HTML5_FMT.DATE);
            if (!resolved.isValid()) {
              resolved = moment();
            }
            let sent = moment(elem.dateSent, moment.HTML5_FMT.DATE);
            let waiting = resolved.diff(sent, "days");
            // console.log(`resolved: ${resolved} sent: ${sent} waiting: ${waiting} `);

            return prevVal + waiting;
          }, 0);
          let avg = sum / singleDateStatus.length;
          return { value: [d, avg] };
        })
        .sort((a, b) => {
          if (a.value[0] < b.value[0]) return -1;
          if (a.value[0] > b.value[0]) return 1;
          return 0;
        });

      return waitTimeByDate;
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
