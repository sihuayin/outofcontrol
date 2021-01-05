<template>
  <div class="loading-container">
    <a-spin size="large" />
  </div>
</template>
<script>
import auth from '../libs/auth'
export default {
  name: 'Loading',
  mounted() {
    setTimeout(() => {
      if (!auth.loggedIn()) {
        this.$router.replace('/login')
      } else if (auth.isZhuanjia()) {
        this.$router.replace('/home')
      } else {
        this.$router.replace('/vistor')
      }
    }, 1000)
  }
}
</script>

<style>
.loading-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

