<template>
  <div>
    &nbsp;
    <internal-pie :chart-data="datacollection" />
  </div>
</template>

<script>
import { Pie } from "vue-chartjs/legacy";
import ChartDataLabels from "chartjs-plugin-datalabels";

let setupComplete = false;
var internalPie = {
  components: { Pie },
  mounted() {
    this.addPlugin({
      id: ChartDataLabels,
      // beforeInit: function (chart) {
      //   ....
      // }
    });
    this.addPlugin({
      id: "hiddenSlices",
      afterDatasetsUpdate: function (chartInstance) {
        // If `hiddenSlices` has been set.
        if (
          chartInstance.config.data.hiddenSlices !== undefined &&
          !setupComplete
        ) {
          // Iterate all datasets.
          // console.log(chartInstance.config.data.hiddenSlices);
          // for (var i = 0; i < chartInstance.data.datasets.length; ++i) {
          // Iterate all indices of slices to be hidden.
          chartInstance.config.data.hiddenSlices.forEach(function (index) {
            // Hide this slice for this dataset.
            chartInstance.getDatasetMeta(0).data[index].hidden = true;
            setupComplete = true;
          });
          // }
          chartInstance.update();
        }
      },
      destroy: function () {
        // console.log("destroy");
        setupComplete = false;
      },
    });
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      plugins: {
        hiddenSlices: {},
        datalabels: {
          backgroundColor: function (context) {
            return context.dataset.backgroundColor;
          },
          borderColor: "white",
          borderRadius: 25,
          borderWidth: 2,
          color: "white",
          display: function (context) {
            var dataset = context.dataset;
            var count = dataset.data.length;
            var value = dataset.data[context.dataIndex];
            return value > count * 1.5;
          },
          font: {
            weight: "bold",
          },
          formatter: Math.round,
        },
      },
    }); //,options);
  },
};

export default {
  components: {
    "internal-pie": internalPie,
  },
  props: ["waiting", "passed", "taken"],
  computed: {
    datacollection: function () {
      return {
        hiddenSlices: [0],
        labels: ["Waiting", "Passed", "Taken"],
        datasets: [
          {
            backgroundColor: ["#F8B379", "#61C661", "#f87979"],
            data: [this.waiting, this.passed, this.taken],
            datalabels: {
              anchor: "end",
            },
          },
        ],
      };
    },
    // },
    // getRandomInt() {
    //   return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    // }
  },
};
</script>
