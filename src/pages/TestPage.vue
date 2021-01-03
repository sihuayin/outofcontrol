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
             <a-card title="你好" size="small">
              <div :style="{width: '300px', height: '240px', background: 'red'}"></div>
            </a-card>
            <a-card title="你好" size="small">
              <div :style="{width: '300px', height: '240px', background: 'blue'}"></div>
            </a-card>
           
           
            
            
            
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
</template>
<script>
import SecondHeader from '../components/SecondHeader'
export default {
  name: 'TestPage',
  components: {
    SecondHeader
  }
}
</script>

<style>
.full-height {
  height: 100%;
}
</style>

