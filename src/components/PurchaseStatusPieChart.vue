<script>
import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  props: ['waiting', 'passed', 'taken'],
    data () {
      return {
        datacollection: null
      }
    },
    mounted () {
      this.fillData();
      this.renderChart(this.datacollection);//,options);
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: ['Waiting', 'Passed', 'Taken'],
          datasets: [
            {
              backgroundColor: ['#F8B379','#61C661','#f87979'],
              data: [this.waiting, this.passed, this.taken]
            }
          ]
        }
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      }      
    }
}
</script>