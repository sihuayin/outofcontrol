<template>
  <a-layout-header>
    <a-row type="flex" justify="space-around">
      <a-col :span="18">
        <img src="../assets/nanshi.png" width="150"/>
      </a-col>
      <a-col :span="6">
        <a-row type="flex" justify="space-around">
          <a-space>
            <LogoutButton />
            <CloseButton />
          </a-space>
        </a-row>
        
        
      </a-col>
    </a-row>
    </a-layout-header>
</template>
<script>
import LogoutButton from './LogoutButton'
import CloseButton from './CloseButton'
export default {
  name: 'CommonHeader',
  components: {
    LogoutButton,
    CloseButton
  }
}
</script>
