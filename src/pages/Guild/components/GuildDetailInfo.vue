<template>
  <div>
    <div class="row justify-around">
      <GuildDetailCard v-model="guild" :edit="auth === 2" v-if="guild !== null"/>
      <q-inner-loading :showing="loading">
        <q-spinner-ios size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GuildDetailCard from 'pages/Guild/components/GuildDetailCard.vue'

@Component({
  components: {
    GuildDetailCard
  }
})
export default class GuildDetailInfo extends Vue {
  loading = false
  @Prop({ required: true }) auth !: number

  guild: any = null

  created () {
    this.loading = true
    this.$axios.get('guild/info')
      .then(response => {
        this.guild = response.data
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
