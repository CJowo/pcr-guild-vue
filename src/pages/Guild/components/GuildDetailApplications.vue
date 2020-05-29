<template>
  <div>
    <q-infinite-scroll ref="infiniteScroll" @load="onLoad" :offset="50">
      <div class="q-pa-md row items-start q-gutter-md justify-center justify-sm-start items-start">
        <GuildDetailApplicationCard v-for="item in applications" :key="item.id" :application="item" @refresh="refresh"/>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { QInfiniteScroll } from 'quasar'
import GuildDetailApplicationCard from 'pages/Guild/components/GuildDetailApplicationCard.vue'

@Component({
  components: {
    GuildDetailApplicationCard
  }
})
export default class GuildDetailEvent extends Vue {
  public $refs !: {
    infiniteScroll: QInfiniteScroll;
  }

  applications: any = []

  onLoad (index: any, done: any) {
    this.$axios.get(`guild/applications?page=${index}`)
      .then(response => {
        if (10 * index >= response.data.count) {
          this.$refs.infiniteScroll.stop()
        }
        this.applications = this.applications.concat(response.data.data)
        done()
      })
  }

  refresh () {
    this.$refs.infiniteScroll.reset()
    this.applications = []
    this.$refs.infiniteScroll.resume()
    this.$refs.infiniteScroll.poll()
  }
}
</script>
