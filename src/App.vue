<template>
  <div v-if="user.token" id="app">
    <router-view/>
  </div>
  <div v-else id="app">
    <Login></Login>
  </div>
</template>

<script>
import Login from '@/components/Login'

export default {
  name: 'App',
  components: {
    Login
  },
  data() {
    return {
      user: this.$user
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  
}
</style>
