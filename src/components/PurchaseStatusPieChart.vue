<template>
  <div>&nbsp;
  <internal-pie :chartData=datacollection />
  </div>
</template>

<script>
import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import { dataLabels } from "chartjs-plugin-datalabels";

var internalPie = {
  extends: Pie,
  mixins: [reactiveProp],
  mounted() {
    this.addPlugin({
      id: dataLabels
      // beforeInit: function (chart) {
      //   ....
      // }
    });
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          borderColor: "white",
          borderRadius: 25,
          borderWidth: 2,
          color: "white",
          display: function(context) {
            var dataset = context.dataset;
            var count = dataset.data.length;
            var value = dataset.data[context.dataIndex];
            return value > count * 1.5;
          },
          font: {
            weight: "bold"
          },
          formatter: Math.round
        }
      }
    }); //,options);
  }
};

export default {
  components: {
    "internal-pie": internalPie
  },
  props: ["waiting", "passed", "taken"],
  computed: {
    datacollection: function() {
      return {
        labels: ["Waiting", "Passed", "Taken"],
        datasets: [
          {
            backgroundColor: ["#F8B379", "#61C661", "#f87979"],
            data: [this.waiting, this.passed, this.taken],
            datalabels: {
              anchor: "end"
            }
          }
        ]
      };
    }
    // },
    // getRandomInt() {
    //   return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    // }
  }
};
</script>
