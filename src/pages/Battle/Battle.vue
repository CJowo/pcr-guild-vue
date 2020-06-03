<template>
  <q-page>
    <q-tabs
      v-model="tab"
      class="text-primary"
    >
      <q-tab name="reports" icon="assignment" :label="$t('battle.reports')" />
      <q-tab name="my" icon="assignment_ind" :label="$t('battle.my')" />
    </q-tabs>
    <router-view />
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class Battle extends Vue {
  tab = 'reports'

  @Watch('tab', { immediate: true })
  onChangeTab (val: string) {
    this.$router.push('/battle/' + val)
  }

  @Watch('$route', { immediate: true })
  onChangeRoute (val: any) {
    if (val.path.startsWith('/battle')) {
      if (this.$store.state.user.data.guild === null) {
        this.$router.replace('/guild/list').catch(err => err)
      } else {
        this.$router.push('/battle/' + this.tab)
      }
    }
  }
}
</script>
