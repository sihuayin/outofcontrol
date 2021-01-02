<template>
<a-layout-header>
  <a-row type="flex" justify="space-around">
    <a-col :span="20">
      <img src="../assets/nanshi.png" width="150"/>
    </a-col>
    <a-col :span="4">
      <a-row type="flex" justify="space-around">
        <a-space>
          <a-button @click="$router.go(-1)" type="primary">
            <a-icon type="close-circle" />返回
          </a-button>
        </a-space>
      </a-row>
    </a-col>
  </a-row>
</a-layout-header>
</template>
<script>
export default {
  name: 'SecondHeader'
}
</script>
