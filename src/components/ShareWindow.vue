<template>
   <a-row :gutter="16">
      <a-col :span="8" v-for="(i, index) in items" :key="index">
        <a-card :title="i.name" :bordered="false">
          <img
            slot="cover"
            alt="example"
            :src="i.image"
          />
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
