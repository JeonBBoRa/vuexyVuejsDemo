<!-- =========================================================================================
    File Name: ChartLineChart.vue
    Description: Create line chart
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->
<!--loaded를 처음에 false로 지정해야 데이터를 먼저 가져온후 차트가 작동되도록 할 수 있다.-->

<template>
<!--  <vx-card title="Line Chart" class="mb-base">-->
  <vx-card :title="`CCTV_${this.sendData} chart`">

    <div class="mt-5">
<!--      <chartjs-component-line-chart-w-k :height="200" :data="data" :options="options"></chartjs-component-line-chart-w-k>-->
      <chartjs-component-line-chart-w-k v-if="loaded" :height="200" :chart-data="datacollection" :options="options"></chartjs-component-line-chart-w-k>
    </div>
  </vx-card>
</template>

<script>
import ChartjsComponentLineChartWK from './charts-components/ChartjsComponentLineChartWK.vue'
export default {
  model: {
    prop : 'sendData',
    event : 'cctv-no-data'
  },
  props: ['sendData'],
  data () {
    return {
      options: {
        title: {
          display: true,
          text: `CCTV_${this.sendData} In&Exit Count`
        },
        responsive: true
      },
      datacollection : null,
      /*처음에 차트 데이터 배열을 null로 선언해준다.*/
      loaded: false
    }
  },
  mounted () {
    this.getData()
    this.startInterval()
  },
  methods : {
    startInterval () {
      this.polling = setInterval(() => {
        this.getData()
      }, 2000)
    },
    getData () {
      const cctv_data = new FormData()
      cctv_data.append('cctvid', `${this.sendData}`)
      this.$http.post('http://192.168.10.102/getData.php', cctv_data, {
      })
        .then(response => {
          this.loaded = true
          this.fillData(response.data)
        }).catch((ex) => {
          console.error('에러 : ', ex)
        })
    },
    fillData (cData) {
      this.datacollection = {
        labels: [],
        datasets:[
          {
            label: 'Exit',
            borderColor: '#7367F0',
            fill: true,
            data:[]
          }, {
            label: 'In',
            borderColor: '#f87979',
            fill: true,
            data:[]
          }
        ]
      }
      //서버에서 받아온 데이터를 차트 데이터 배열안에 넣어준다.
      for (let i = 0; i < Object.keys(cData).length; i++) {
        this.datacollection.labels.push(cData[i].date)
        this.datacollection.datasets[0].data.push(Number(cData[i].exit_count))
        this.datacollection.datasets[1].data.push(Number(cData[i].inCnt))
      }
      this.loaded = true
    }
  },
  beforeDestroy () {
    clearInterval(this.polling) //시간 정리
  },
  components: {
    ChartjsComponentLineChartWK
  }
}
</script>
