<template>
  <q-dialog v-model="visiable" @input="val => $emit('input', val)">
    <q-table
      title="Treats"
      :data="users"
      :columns="[
        { name: 'nickname', label: $t('user.nickname'), field: 'nickname', align: 'cneter' },
        { name: 'count', label: $t('battle.today.count'), field: 'count', sortable: true, align: 'cneter' }
      ]"
      row-key="username"
    >
      <template v-slot:top>
        <div class="row justify-between full-width items-center">
          <span class="text-h6">{{ $t('battle.today.title') }}</span>
          <q-btn flat round icon="close" class="on-right" v-close-popup size="sm"/>
        </div>
      </template>
    </q-table>
    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Component, Model, Watch } from 'vue-property-decorator'

@Component
export default class BattleToday extends Vue {
  @Model('input') value !: boolean

  visiable = false

  @Watch('value', { immediate: true })
  change () {
    this.visiable = this.value
  }

  users: any = []
  loading = true

  created () {
    this.$axios.get('report/today')
      .then(response => {
        this.users = response.data
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
