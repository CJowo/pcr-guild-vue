<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'app'
})
export default class App extends Vue {
  created () {
    if (this.$q.localStorage.getItem('login') !== true) {
      this.$router.push('/login')
    } else {
      this.$store.dispatch('user/getInfo')
    }
  }
}
</script>
