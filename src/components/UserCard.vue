<template>
  <q-card style="min-width: 250px">
    <q-card-section class="q-gutter-y-md">
      <div class="row items-center q-gutter-sm">
        <q-avatar color="primary" text-color="white" icon="account_circle" size="md" />
        <span class="text-h6">{{ user.nickname }}</span>
      </div>

      <div class="row justify-around items-start">
        <div style="min-width: 80px">
          <q-field borderless :label="$t('user.username')" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{ user.username }}</div>
            </template>
          </q-field>

          <q-field borderless :label="$t('user.create')" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{ formatDate(user.create*1000) }}</div>
            </template>
          </q-field>

          <q-field borderless :label="$t('user.guild')" stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0" v-if="user.guild">{{ user.guild.name }}</div>
            </template>
          </q-field>
        </div>

        <q-field borderless :label="$t('user.desc')" stack-label style="min-width: 100px">
          <template v-slot:control>
            <div class="self-center full-width no-outline">
              <div class="q-mt-xs" style="white-space: pre">{{ user.desc }}</div>
            </div>
          </template>
        </q-field>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class UserCard extends Vue {
  @Prop({ type: Object, required: true }) user !: any

  formatDate (timestamp: number) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }
}
</script>
