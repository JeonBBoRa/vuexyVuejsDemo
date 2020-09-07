<template>
  <div id="dashboard-live">
    <div class="vx-row">
      <div class="vx-col w-full lg:w-1/2" id="img1">
        <vx-card slot="no-body">
          <img :src="imagesrc0" width="100%">
        </vx-card>
      </div>
      <div class="vx-col w-full lg:w-1/2" id="img2">
        <vx-card slot="no-body">
          <img :src="imagesrc1" width="100%">
        </vx-card>
      </div>
      <div class="vx-col w-full md:w-1/2" id="crt1">
        <ChartjsLinerChartWK v-model="cctv1"></ChartjsLinerChartWK>
      </div>
      <div class="vx-col w-full md:w-1/2" id="crt2">
        <ChartjsLinerChartWK v-model="cctv2"></ChartjsLinerChartWK>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import ChartjsLinerChartWK from '@/views/charts-and-maps/charts/chartjs/ChartjsLinerChartWK.vue'

export default {
  components:{
    ChartjsLinerChartWK
  },

  name: 'DashboardLiveBak',
  data () {
    return {
      imagesrc0: [], //이미지출력 1
      imagesrc1: [],  //이미지출력 2
      cctv1: '1', //1번cctv
      cctv2: '2'  //2번cctv
    }
  },
  created () {
    const vm = this
    for (var i = 0; i < 2; i += 1) {
      console.log(this.$socket.client.emit('access', i)) //페이지 초기 접속
      // this.$socket.client.emit('access', i); //페이지 초기 접속
      console.log(this.$socket.client.emit('gstStart', i))// 이미지 요청 이벤트
      // this.$socket.client.emit('gstStart', i) // 이미지 요청 이벤트
      // console.log("접속 " + i)
    }
    // this.$socket.client.emit('access', 0); //페이지 초기 접속
    // this.$socket.client.emit('gstStart', 0) // 이미지 요청 이벤트
    this.$socket.client.on('resImage', function (stream, tasknum) { //이미지 출력
      if (tasknum === 0) {
        vm.imagesrc0 = 'data:image/jpeg;base64,' + stream.toString("base64")
        // console.log("======tasknum0======");
        // console.log(tasknum);
        // console.log("====================");
      }
      else if (tasknum === 1) {
        vm.imagesrc1 = 'data:image/jpeg;base64,' + stream.toString("base64")
        // console.log("======tasknum1======");
        // console.log(tasknum);
        // console.log("====================");
      }
    })
  },
  sockets: {
    connect () {
      // Fired when the socket connects.
      this.isConnected = true;
      console.log("connect!!!");
    },

    disconnect () {
      this.isConnected = false;
      console.log("disconnect!!!");
      location.reload();
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel (data) {
      this.socketMessage = data;
      console.log("messageChannel!!!");
    }
  }
}
</script>


<!--<style scoped>-->
<style>
#img1{height: 45vh; margin-bottom: 3vh;}
#img2{height: 45vh; margin-bottom: 3vh;}
#crt1{height: 30vh}
#crt2{height: 30vh}
.router-view{padding-top: 1rem;}
</style>
