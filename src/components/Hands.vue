<template>
  <a-card title="举手列表" size="small">
    <a-list item-layout="horizontal" :data-source="hands" :bordered="true" :style="{'margin-top': '20px'}">
      <a-list-item slot="renderItem" slot-scope="item">
      <a slot="actions" @click="goLive(item.id)">加入</a>
      <a-list-item-meta
        description="test"
        :title="item.name"
      >

      </a-list-item-meta>
    </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
export default {
  name: 'Hands',
  props: ['hands'],
  methods: {
    goLive(id) {
      this.$emit('select', id)
    }
  }
}
</script>
