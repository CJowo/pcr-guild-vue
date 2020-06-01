<template>
  <q-infinite-scroll ref="infiniteScroll" @load="onLoad" :offset="50">
    <div class="q-pa-md row items-start q-gutter-md justify-center justify-sm-start items-start">
      <Report v-for="(item, index) in reports" :key="index" v-model="reports[index]" :editable="true" @delete="reports.splice(index, 1)" />
    </div>
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { QInfiniteScroll } from 'quasar'
import Report from 'pages/Battle/components/Report.vue'

@Component({
  components: {
    Report
  }
})
export default class BattleMy extends Vue {
  public $refs !: {
    infiniteScroll: QInfiniteScroll;
  }

  reports: any = []

  onLoad (index: any, done: any) {
    this.$axios.get(`report/mylist?page=${index}`)
      .then(response => {
        if (index * 10 >= response.data.count) {
          this.$refs.infiniteScroll.stop()
        }
        this.reports = this.reports.concat(response.data.data)
        done()
      })
  }
}
</script>
