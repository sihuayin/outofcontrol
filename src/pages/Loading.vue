<template>
  <div>
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
      } else if (auth.role === 'zhuanjia') {
        this.$router.replace('/home')
      } else {
        this.$router.replace('/vistor')
      }
    }, 1000)
  }
}
</script>
