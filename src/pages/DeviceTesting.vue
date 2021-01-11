<template>
  <a-layout class="main">
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <a-steps :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
      <component :is="steps[current].com" />
    </div>
    <div class="steps-action">
      <a-button v-if="current < steps.length - 1" type="primary" @click="next">
        下一步
      </a-button>
      <a-button
        v-if="current == steps.length - 1"
        type="primary"
        @click="$router.go(-1)"
      >
        完成
      </a-button>
      <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
        上一步
      </a-button>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SecondHeader from '../components/SecondHeader'
import CameraTesting from '../components/CameraTesting'
import MicphoneTest from '../components/MicphoneTest'
import SoundTest from '../components/SoundTest'

export default {
  name: 'DeviceTesting',
  components: {
    SecondHeader,
    CameraTesting,
    MicphoneTest,
    SoundTest
  },
  data() {
    return {
      current: 0,
      steps: [
        {
          title: '摄像头检测',
          com: 'CameraTesting',
          content: 'First-content',
        },
        {
          title: 'Second',
          com: 'MicphoneTest',
          content: 'Second-content',
        },
        {
          title: 'Last',
          com: 'SoundTest',
          content: 'Last-content',
        },
      ],
    };
  },
  computed: mapState({
    datings: state => state.docter.datings
  }),
  mounted() {
    // this.getDocterDatings()
  },
  methods: {
    ...mapActions('docter', [
      'getDocterDatings'
    ]),
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    }
  }
}
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 400px;
  text-align: center;
  padding-top: 80px;
}

.steps-action {
  margin-top: 24px;
}
</style>