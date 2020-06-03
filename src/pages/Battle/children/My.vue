<template>
  <q-infinite-scroll ref="infiniteScroll" @load="onLoad" :offset="50">
    <div>
      <div v-for="(val, key) in reports" :key="key">
        <div class="text-h6 text-center">{{ key }}</div>
        <div class="q-pa-md row items-start q-gutter-md justify-center justify-sm-start items-start">
          <Report v-for="(item, index) in val" :key="index" v-model="val[index]" :editable="operater" @delete="val.splice(index, 1)" />
        </div>
      </div>
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

  reports: any = {}

  onLoad (index: any, done: any) {
    this.$axios.get(`report/mylist?page=${index}`)
      .then(response => {
        if (index * 10 >= response.data.count) {
          this.$refs.infiniteScroll.stop()
        }
        for (let i in response.data.data) {
          let key = response.data.data[i].finish
          if (this.reports[key] === undefined) {
            this.$set(this.reports, key, [])
          }
          this.reports[key].push(response.data.data[i])
        }
        done()
      })
  }
}
</script>
