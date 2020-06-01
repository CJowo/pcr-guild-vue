<template>
  <q-page>
    <router-view />
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Admin extends Vue {
  @Watch('$route', { immediate: true })
  onChangeRoute (val: any) {
    if (val.path.startsWith('/admin')) {
      if (this.$store.state.admin.password === null) {
        this.$router.replace('/admin/validate').catch(err => err)
      } else {
        this.$router.replace('/admin/detail').catch(err => err)
      }
    }
  }
}
</script>
