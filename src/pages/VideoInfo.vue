<template>
  <a-layout class="main">
    <SecondHeader />
    <a-layout-content :style="{marginTop: '20px'}">
      <a-card hoverable style="width: 100%">
        <template v-if="type === 'image'" slot="cover">
          <viewer :images="images" style="max-height: 500px">
            <img v-for="src in images" :src="src" :key="src">
          </viewer>
        </template>
        <template v-else slot="cover">
          <video width="620" controls style="max-height: 500px">
            <source
              :src="video"
              type="video/mp4">
          </video>
        </template>
        <a-card-meta :title="item.fullname">
          <template slot="description">
            {{item.doctitle}}
          </template>
        </a-card-meta>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>
<script>
import SecondHeader from '../components/SecondHeader'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer/src/component.vue'

export default {
  name: 'VideoInfo',
  components: {
    SecondHeader,
    Viewer
  },
  data() {
    return {
      type: '',
      images: [],
      video: '',
      item: {}
    }
  },
  created() {
    const {item} = this.$route.query
    if (item) {
      if (!item.mimetype) {
        this.type = 'image'
        this.images = [item.url]
      } else {
        this.type = 'video'
        this.video = item.url
      }
      this.item = item
    }
  
  }
}
</script>

<style>
.video-container {
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
