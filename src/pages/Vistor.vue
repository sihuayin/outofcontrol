<template>
  <a-layout class="main">
      <CommonHeader />
      <a-layout-content>
        <a-row type="flex" justify="space-around" align="top">
          <a-card hoverable>
          <template slot="actions" class="ant-card-actions">
             <a-button type="primary" @click="goOneApply">
              申请
            </a-button>
          </template>
          <a-card-meta title="一对一">
          <template slot="description">
            预约与专家一对一远程问诊
          </template>
        </a-card-meta>
        </a-card>
        <a-card hoverable>
          <template slot="actions" class="ant-card-actions">
             <a-button type="primary">
              进入
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
              <a-button type="primary" @click="goVideoList">
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
        

        <a-list item-layout="horizontal" :data-source="datings" :bordered="true" :style="{'margin-top': '20px'}">
          <div slot="header">
            可以直播的列表
          </div>
          <a-list-item slot="renderItem" slot-scope="item">
          <a slot="actions" @click="goLive(item.id)">加入</a>
          <a-list-item-meta
            description="test"
            title="sssssss"
          >

          </a-list-item-meta>
        </a-list-item>
        </a-list>
      </a-layout-content>
    </a-layout>
</template>
<script>
import joinMixin from '../mixins/joinMixin'
import CommonHeader from '../components/CommonHeader'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Vistor',
  components: {
    CommonHeader
  },
  mixins: [joinMixin],

  computed: mapState({
    datings: state => state.docter.datings
  }),
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
    this.getDocterDatings(1, 50, 'unfinished')
  }
}
</script>

<style>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
