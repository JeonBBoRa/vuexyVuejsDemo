<!-- =========================================================================================
  File Name: ChartjsComponentLineChart.vue
  Description: Chartjs component - Line Chart
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<!--이 부분은 나도 모르겠당 ㅎ.ㅎ 걍 이대로 쓰면 실시간으로 데이터가 변경됨 mixin 공부하자.-->
<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  methods: {
  }
}
</script>
