<script>
import { Pie, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ["waiting", "passed", "taken"],
  mounted() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false
    }); //,options);
  },
  computed: {
    chartData: function() {
      return {
        labels: ["Waiting", "Passed", "Taken"],
        datasets: [
          {
            backgroundColor: ["#F8B379", "#61C661", "#f87979"],
            data: [this.waiting, this.passed, this.taken]
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
