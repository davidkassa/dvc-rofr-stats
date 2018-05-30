<template>
  <chart :options="option"></chart>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";

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
// import "echarts/lib/chart/boxplot";
import "echarts/lib/chart/candlestick";
// import "echarts/lib/chart/effectScatter";
// import "echarts/lib/chart/lines";
// import "echarts/lib/chart/heatmap";

// import "echarts/lib/component/graphic";
// import "echarts/lib/component/grid";
// import "echarts/lib/component/legend";
// import "echarts/lib/component/tooltip";
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
  data() {
    return {
      option: {
        xAxis: {
          data: ["2017-10-24", "2017-10-25", "2017-10-26", "2017-10-27"]
        },
        yAxis: {},
        series: [
          {
            type: "k",
            data: [
              {
                name: "grey",
                value: [20, 30, 10, 35],
                itemStyle: { color: "#c6c6c6", color0: "#c6c6c6" }
              },
              [40, 35, 30, 55],
              [33, 38, 33, 40],
              [40, 40, 32, 42]
            ]
          }
        ]
      }
    };
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
