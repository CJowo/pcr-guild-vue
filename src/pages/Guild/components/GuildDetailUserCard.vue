<template>
  <q-card style="width: 300px">
    <q-card-section class="q-gutter-y-md">
      <div class="row items-center q-gutter-sm no-wrap">
        <q-avatar :color="auth===-1? 'accent' : operater? 'red' : 'primary'" text-color="white" icon="account_circle" size="md" />
        <span class="text-h6">{{ `${user.nickname}(${user.username})` }}</span>
      </div>
    </q-card-section>

    <q-card-actions align="around">
      <q-btn flat v-if="auth >= 2 && !operater" @click="operate(true)">{{ $t('guild.guildDetail.setOperate') }}</q-btn>
      <q-btn flat v-if="auth >= 2 && operater" @click="operate(false)">{{ $t('guild.guildDetail.undoOperate') }}</q-btn>
      <q-btn flat v-if="auth >= 1 && !operater" color="negative" @click="kick">{{ $t('guild.guildDetail.kick') }}</q-btn>
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

  @Prop({ required: true }) user !: any
  @Prop({ type: Boolean, default: false }) operater !: boolean
  @Prop({ required: true }) auth !: number

  operate (val: boolean) {
    this.loading = true
    this.$axios.post('guild/operate', {
      username: this.user.username,
      set: val
    })
      .then(() => {
        this.$emit('refresh')
      })
      .finally(() => {
        this.loading = false
      })
  }

  kick () {
    this.$q.dialog({
      title: this.$t('guild.guildCard.kickConfirm') as string,
      message: this.user.nickname + `(${this.user.username})`,
      cancel: true,
      persistent: true
    })
      .onOk(() => {
        this.loading = true
        this.$axios.post('guild/kick', {
          username: this.user.username
        })
          .then(() => {
            this.$emit('refresh')
          })
          .finally(() => {
            this.loading = false
          })
      })
  }
}
</script>
