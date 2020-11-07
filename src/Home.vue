<template>
  <a-layout class="main">
      <a-layout-header>Header</a-layout-header>
      <a-layout-content>
        <div
          v-infinite-scroll="handleInfiniteOnLoad"
          class="demo-infinite-container"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10"
        >
          <a-list :data-source="data">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="item.email">
                <a slot="title" :href="item.href">{{ item.name.last }}</a>
                <a-avatar
                  slot="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </a-list-item-meta>
              <div>
                <a-button type="primary" @click="goRoom">加入</a-button></div>
            </a-list-item>
            <div v-if="loading && !busy" class="demo-loading-container">
              <a-spin />
            </div>
          </a-list>
        </div>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll'
export default {
  name: 'Home',
  directives: { infiniteScroll },
  data() {
    return {
      busy: false,
      loading: false,
      data: [{
        email: 'test',
        name: {
          last: 'tt'
        }
      }]
    }
  },
  methods: {
    handleInfiniteOnLoad() {},
    goRoom() {
      this.$router.push("/root")
    }
  }
}
</script>

<style>
.main {
  height: 100%;
}
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>

