<template>
  <chart :options="option"></chart>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";
import * as moment from "moment";
import MA from "moving-average";
const DAY = 24 * 60 * 60 * 1000; //1 day
// import dataTool from "echarts/dist/extension/dataTool";

import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
// import "echarts/lib/chart/pie";
// import "echarts/lib/chart/scatter";
// import "echarts/lib/chart/radar";

// import "echarts/lib/chart/map";
// import "echarts/lib/chart/treemap";
// import "echarts/lib/chart/graph";
// import "echarts/lib/chart/gauge";
// import "echarts/lib/chart/funnel";
// import "echarts/lib/chart/parallel";
// import "echarts/lib/chart/sankey";
// import "echarts/lib/chart/boxplot";
// import "echarts/lib/chart/candlestick";
// import "echarts/lib/chart/effectScatter";
// import "echarts/lib/chart/lines";
// import "echarts/lib/chart/heatmap";

// import "echarts/lib/component/graphic";
// import "echarts/lib/component/grid";
// import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
// import "echarts/lib/component/polar";
// import "echarts/lib/component/geo";
// import "echarts/lib/component/parallel";
// import "echarts/lib/component/singleAxis";
// import "echarts/lib/component/brush";

// import "echarts/lib/component/title";

// import "echarts/lib/component/dataZoom";
// import "echarts/lib/component/visualMap";

// import "echarts/lib/component/markPoint";
// import "echarts/lib/component/markLine";
// import "echarts/lib/component/markArea";

// import "echarts/lib/component/timeline";
// import "echarts/lib/component/toolbox";

// import "zrender/lib/vml/vml";

export default {
  components: {
    chart: ECharts
  },
  props: ["waiting", "passed", "taken"],
  data() {
    return {};
  },
  computed: {
    option: function() {
      return {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["Passed", "Waiting", "Taken"]
        },
        xAxis: {
          type: "time",
          boundaryGap: false
        },
        yAxis: {
          type: "value",
          boundaryGap: false,
          splitLine: {
            show: false
          },
          min: "dataMin",
          max: "dataMax"
        },
        series: [
          {
            name: "Passed",
            type: "line",
            lineStyle: { color: "#61c661" },
            itemStyle: { color: "#61c661", borderColor: "#3CAA3C" },
            data: this.passedPricesPerPointByDate
          },
          {
            name: "Waiting",
            type: "line",
            lineStyle: { color: "#f8b379" },
            itemStyle: { color: "#f8b379", borderColor: "#D4894B" },
            data: this.waitingPricesPerPointByDate
          },
          {
            name: "Taken",
            type: "line",
            lineStyle: { color: "#f87979" },
            itemStyle: { color: "#f87979", borderColor: "#D44B4B" },
            data: this.takenPricesPerPointByDate
          }
        ]
      };
    },
    passedPricesPerPointByDate: function() {
      return this.getPricesPerPointByDate(this.passed);
    },
    waitingPricesPerPointByDate: function() {
      return this.getPricesPerPointByDate(this.waiting);
    },
    takenPricesPerPointByDate: function() {
      return this.getPricesPerPointByDate(this.taken);
    }
  },
  methods: {
    getMovingAverageOfPricesPerPointByDate(status) {
      let prices = this.getPricesPerPointByDate(status);
      let movingAverage = [];
      let ma = MA(DAY);
      prices.map(p => {
        ma.push(moment.utc(p.value[0]), p.value[1]);
        movingAverage.push({ value: [p.value[0], ma.movingAverage()] });
      });
      return movingAverage;
    },
    getPricesPerPointByDate(status) {
      let uniqueDates = [...new Set(status.map(s => s.dateSent))];
      let pppByDate = uniqueDates
        .map(d => {
          let singleDateStatus = status.filter(s => s.dateSent == d);
          let sum = singleDateStatus.reduce(function(prevVal, elem) {
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
    }
  }
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
</style>
