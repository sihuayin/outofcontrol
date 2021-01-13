<template>
  <a-layout class="main">
      <CommonHeader />
      <a-layout-content>
        <a-row type="flex" justify="space-around" align="top">
         
        <a-card hoverable>
          <template slot="actions" class="ant-card-actions">
             <a-button type="dashed" disabled>
              暂未开放
            </a-button>
          </template>
          <a-card-meta title="直播课">
          <template slot="description">
            直播听专家讲座
          </template>
        </a-card-meta>
        </a-card>
          <a-card hoverable>
            <template slot="actions" class="ant-card-actions">
              <a-button type="dashed"  @click="goVideoList">
                进入
              </a-button>
            </template>
            <a-card-meta title="学习中心">
            <template slot="description">
              点播医疗教学视频
            </template>
          </a-card-meta>
          </a-card>
        </a-row>
        
<div
    class="demo-infinite-container"
    :infinite-scroll-disabled="false"
    :infinite-scroll-distance="10"
  >
        <a-list item-layout="horizontal" :data-source="unfinshed" :bordered="true" :style="{'margin-top': '20px'}">
          <div slot="header">
            可以直播的列表
          </div>
          <a-list-item slot="renderItem" slot-scope="item">
          <a slot="actions" @click="goLive(item.meetingid)">加入</a>
          <a-list-item-meta
            :description="item.appointmentdesc"
            :title="item.expertname"
          >
            
          </a-list-item-meta>
          <div>{{item.startdttm}}</div>
        </a-list-item>
        </a-list>
</div>
      </a-layout-content>
    </a-layout>
</template>
<script>
import joinMixin from '../mixins/joinMixin'
import CommonHeader from '../components/CommonHeader'
import { mapActions, mapGetters } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll';
export default {
  name: 'Vistor',
  directives: { infiniteScroll },
  components: {
    CommonHeader
  },
  mixins: [joinMixin],

  computed: {
    ...mapGetters('docter', {
      unfinshed: 'unfinshed'
    })
  },
  methods: {
    ...mapActions('docter', [
      'getDocterDatings'
    ]),
    goOneApply() {
      this.$router.push('/oneapply')
    },
    goVideoList() {
      this.$router.push('/videolist')
    }
  },
  mounted() {
    this.getDocterDatings({
      page: 1,
      pageSize: 50
    })
  }
}
</script>

<style>
.demo-loadmore-list {
  min-height: 350px;
}
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 450px;
  
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
