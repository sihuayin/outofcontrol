<template>
  <a-layout class="main">
      <SecondHeader />
      <a-layout-content>
        <a-row type="flex" class="full-height">
          <a-col flex="auto" class="full-height">
            <a-card title="共享内容" class="full-height">
              <a-button slot="extra" type="primary" ghost>共享屏幕</a-button>
              <div :style="{width: '100%', height: '100%'}"></div>
            </a-card>
            
          </a-col>
          <a-col flex="300px">
             <!-- <a-card title="你好" size="small">
              <div :style="{width: '300px', height: '240px', background: 'red'}"></div>
            </a-card> -->
            <VistorWindow v-if="specialist && specialist.rtc" :uid="specialist.id" :name="specialist.name" />
            <a-card title="专家" size="small" v-else>
              <div :style="{width: '300px',  height: '230px', overflow: 'hidden'}">未加入</div>
            </a-card>
            <VistorWindow v-if="vistor && vistor.rtc" :uid="vistor.id" :name="vistor.name" />
            <!-- <a-card title="你好" size="small">
              <div :style="{width: '300px', height: '240px', background: 'blue'}"></div>
            </a-card>
            -->
           
            <!-- <a-card title="参与" size="small" v-if="canHandUp">
              <a-button @click="handUp" type="primary" ghost><a-icon type="video-camera" />举手</a-button>
            </a-card> -->
            
            
          </a-col>
        </a-row>
      </a-layout-content>
       <a-layout-footer>{{members}}, {{specialist}}</a-layout-footer>
    </a-layout>
</template>
<script>
import SecondHeader from '../components/SecondHeader'
// import Rtm from '../libs/rtm'
// import config from '../config/config'
// import auth from '../libs/auth'
import VistorWindow from '../components/VistorWindow'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'TestPage',
  components: {
    SecondHeader,
    VistorWindow
  },
   computed: {
    ...mapState({
      // vistor: state => state.room.vistor,
      // specialist: state => state.room.specialist,
      roomInfo: state => state.room.roomInfo,
      members: state => state.room.members
    }),
    ...mapGetters('room', {
      specialist: 'specialist',
      vistor: 'vistor'
    })
  },
  methods: {
    ...mapActions('room', [
      'setDisplayInfo',
      'addMember'
    ]),
  },
  async mounted () {
    // // rtm加入
    // this.addMember({
    //   id: 1,
    //   role: '专家',
    //   roleId: 8,
    //   name: 'liaojie'
    // })
    // setTimeout(() => {
    // // rtc加入
    // this.addMember({
    //   id: 1,
    //   role: '专家',
    //   rtc: true
    // })
    // }, 5000)

    // rtm加入
    this.addMember({
      id: 2,
      role: 'yisheng',
      roleId: 4,
      name: 'kk'
    })
        this.addMember({
      id: 21,
      role: 'yisheng',
      roleId: 4,
      name: 'kk1'
    })
        this.addMember({
      id: 22,
      role: 'yisheng',
      roleId: 4,
      name: 'kk2'
    })
    // setTimeout(() => {
    // // rtc加入
    // this.addMember({
    //   id: 2,
    //   rtc: true
    // })
    // }, 5000)

  }
}
</script>

<style>
.full-height {
  height: 100%;
}
</style>

