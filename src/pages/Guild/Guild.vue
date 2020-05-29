<template>
  <q-page>
    <router-view />
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Guild extends Vue {
  get user () { return this.$store.state.user.data }

  @Watch('user', { immediate: true, deep: true })
  onChangeUser (val: any) {
    if (this.user.username === null) return
    if (val.guild === null) {
      this.$router.replace('/guild/list').catch(err => err)
    } else {
      this.$router.replace('/guild/detail').catch(err => err)
    }
  }

  @Watch('$route')
  onChangeRoute (val: any) {
    if (val.path.startsWith('/guild')) {
      if (this.$store.state.user.data.guild === null) {
        this.$router.replace('/guild/list').catch(err => err)
      } else {
        this.$router.replace('/guild/detail').catch(err => err)
      }
    }
  }
}
</script>
