<template>
  <q-page>
    <span class="text-h3 center">{{ $t('logout.wait') }}</span>
    <q-inner-loading :showing="true">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Logout extends Vue {
  mounted () {
    this.$axios.get('user/logout')
      .then(() => {
        this.$q.localStorage.remove('login')
        this.$store.commit('user/update', {})
        this.$router.replace('/login')
      })
  }
}
</script>
