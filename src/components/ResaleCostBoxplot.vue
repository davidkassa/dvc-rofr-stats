<template>
  <chart :options="option"></chart>
</template>

<script>
import ECharts from "vue-echarts";
import dataTool from "echarts/dist/extension/dataTool";

// import "echarts/lib/chart/line";
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
import "echarts/lib/chart/boxplot";
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
    preparedData: function() {
      return dataTool.prepareBoxplotData([
        this.passedPricesPerPoint,
        this.waitingPricesPerPoint,
        this.takenPricesPerPoint
      ]);
    },
    option: function() {
      return {
        xAxis: {
          data: ["Passed", "Waiting", "Taken"]
        },
        yAxis: { min: "dataMin", max: "dataMax" },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow"
          }
        },
        series: [
          {
            name: "boxplot",
            type: "boxplot",
            data: this.colorBoxData(
              this.preparedData == null ? null : this.preparedData.boxData
            ),
            tooltip: {
              formatter: function(param) {
                // console.log(param);
                return [
                  param.name,
                  "Upper: " + param.data.value[5],
                  "Q3: " + param.data.value[4],
                  "Median: " + param.data.value[3],
                  "Q1: " + param.data.value[2],
                  "Lower: " + param.data.value[1]
                ].join("<br/>");
              }
            }
          },
          {
            name: "Outlier",
            type: "scatter",
            data: this.colorOutliers(
              this.preparedData == null ? null : this.preparedData.outliers
            )
          }
        ]
      };
    },
    passedPricesPerPoint: function() {
      return this.passed.map(p => p.pricePerPoint);
    },
    waitingPricesPerPoint: function() {
      return this.waiting.map(w => w.pricePerPoint);
    },
    takenPricesPerPoint: function() {
      return this.taken.map(t => t.pricePerPoint);
    }
  },
  methods: {
    colorBoxData(boxData) {
      if (boxData == null) return null;
      return boxData.map((d, i) => ({
        value: d,
        itemStyle: this.colorData(i)
      }));
    },
    colorOutliers(outliers) {
      if (outliers == null) return null;
      return outliers.map(o => ({ value: o, itemStyle: this.colorData(o[0]) }));
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
        borderColor0: borderColor
      };
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

<style lang="scss" scoped></style>
