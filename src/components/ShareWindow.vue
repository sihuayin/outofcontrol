<template>
   <a-row :gutter="16">
      <a-col :span="6" v-for="(i, index) in items" :key="index">
        <a-card :title="i.name" :bordered="false">
          <div :style="{width: '100%', height: '240px', backgroundImage: `url(data:image/png;base64,${i.image})` }"></div>
          <template slot="actions" class="ant-card-actions">
             <a-button type="primary" @click="showPreview(i.windowId)">
              选择
            </a-button>
          </template>
        </a-card>
      </a-col>
     
    </a-row>
</template>

<script>
export default {
  name: 'ShareWindow',
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    showPreview(windowId) {
      this.$emit('display', windowId)
    }
  }
}
</script>
