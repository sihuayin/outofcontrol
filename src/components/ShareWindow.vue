<template>
   <a-row :gutter="16">
      <a-col :span="8" v-for="(i, index) in items" :key="index">
        <a-card :title="i.name" :bordered="false">
          <img
            slot="cover"
            alt="example"
            :src="`data:image/png;base64,${i.image}`"
          />
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
  }
}
</script>
