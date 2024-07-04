<template>
  <v-chart class="chart" :option="option"/>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BoxplotChart, ScatterChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { prepareBoxplotData } from "echarts/dist/extension/dataTool";
import VChart from "vue-echarts";
use([CanvasRenderer, BoxplotChart, GridComponent,TooltipComponent, ScatterChart]);

export default {
  components: {
    VChart,
  },
  props: ["waiting", "passed", "taken"],
  data() {
    return {};
  },
  computed: {
    preparedData: function () {
      return prepareBoxplotData([
        this.passedPricesPerPoint,
        this.waitingPricesPerPoint,
        this.takenPricesPerPoint,
      ]);
    },
    option: function () {
      return {
        xAxis: {
          data: ["Passed", "Waiting", "Taken"],
        },
        yAxis: { min: "dataMin", max: "dataMax" },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow",
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
    colorData(status) {
      let color, borderColor;
      switch (status) {
        case 0:
          color = "#61c661";
          borderColor = "#3CAA3C";
          break;
        case 1:
          color = "#f8b379";
          borderColor = "#D4894B";
          break;
        case 2:
          color = "#f87979";
          borderColor = "#D44B4B";
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
