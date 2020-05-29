<template>
  <q-card style="width: 300px">
    <q-card-section class="q-gutter-y-md">
      <div class="row items-center q-gutter-sm no-wrap">
        <q-avatar color="primary" text-color="white" icon="account_circle" size="md" />
        <span class="text-h6">{{ `${application.user.nickname}(${application.user.username})` }}</span>
      </div>
      <div class="q-ml-md text-body1" style="word-wrap: break-word">{{ application.desc }}</div>
    </q-card-section>
    <q-card-actions align="around">
      <q-btn v-if="application.status===null" flat color="primary" @click="validate(true)">{{ $t('guild.guildDetail.resolve') }}</q-btn>
      <q-btn v-if="application.status===null" flat color="negative" @click="validate(false)">{{ $t('guild.guildDetail.reject') }}</q-btn>
      <span v-if="application.status===true" class="text-positive" > {{ $t('guild.guildDetail.resolved') }} </span>
      <span v-if="application.status===false" class="text-negative"> {{ $t('guild.guildDetail.rejected') }} </span>
    </q-card-actions>

    <q-inner-loading :showing="loading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class GuildDetailUserCard extends Vue {
  loading = false

  @Prop({ required: true }) application !: any

  validate (val: boolean) {
    this.loading = true

    this.$axios.post('guild/validate', {
      id: this.application.id,
      allow: val
    })
      .then(() => {
        this.$emit('refresh')
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
