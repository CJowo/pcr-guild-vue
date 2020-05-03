<template>
  <span></span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Select extends Vue {
  created () {
    this.$Http.logout()
      .finally(() => { this.$router.go(-1) })
  }
}
</script>
