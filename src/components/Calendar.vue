<template>
  <div>
    <div>
      <q-chip
        v-for="(value, key) in tags"
        :key="key"
        label
        dark
        class="col-0"
        :color="value[0]"
        v-text="value[1]"
      />
    </div>
    <div class="q-pa-md">
      <div class="row justify-center q-gutter-sm" style="width: auto">
        <q-intersection
          v-for="index in count"
          :key="index"
          once
          transition="scale"
          class="example-item"
        >
          <q-card v-if="events[index] && events[index].status == 'positive'" class="bg-positive text-white">
            &nbsp;
            <p class="text-bold text-center">
              {{ events[index].name }}
            </p>
            <q-card-section style="background-color: gray;color: white">
              <div>开始于:{{ events[index].startTime }}</div>
              <div>结束于:{{ events[index].endTime }}</div>
            </q-card-section>
          </q-card>
          <q-card v-if="events[index] && events[index].status == 'primary'" class="bg-primary text-white">
            &nbsp;
            <p class="text-bold text-center">
              {{ events[index].name }}
            </p>
            <q-card-section style="background-color: gray;color: white">
              <div>开始于:{{ events[index].startTime }}</div>
              <div>结束于:{{ events[index].endTime }}</div>
            </q-card-section>
          </q-card>
          <q-card v-if="events[index] && events[index].status == 'accent'" class="bg-accent text-white">
            &nbsp;
            <p class="text-bold text-center">
              {{ events[index].name }}
            </p>
            <q-card-section class="bg-blue-grey text-white">
              <div>开始于:{{ events[index].startTime }}</div>
              <div>结束于:{{ events[index].endTime }}</div>
            </q-card-section>
          </q-card>
        </q-intersection>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

function parseDate (datestring) {
  let [d, t] = datestring.split(" ")
  let [yy, mm, dd] = d.split("/")
  let hh = t.split(":")[0]
  return new Date(yy, mm - 1, dd, hh)
}

export default {
  name: 'Calendar',
  components: {},
  data () {
    return {
      tags: {
        outdated: ['accent', '已经结束的活动'],
        current: ['positive', '正在进行的活动'],
        incoming: ['primary', '即将到来的活动']
      },
      events: [{
        name: {},
        startTime: {},
        endTime: {}
      }],
      count: 0
    }
  },
  created () {
    this.sortEvents()
  },
  destroyed () {
    clearInterval(this.counter)
  },
  methods: {
    sortEvents () {
      axios
        .get("https://bird.ioliu.cn/v1?url=https://tools.yobot.win/calender/cn.json")
        .then((res) => {
          for (let i = 0; i < res.data.length; i++) {
            let campaign = res.data[i]
            let startTime = parseDate(campaign.start_time)
            let endTime = parseDate(campaign.end_time)
            let status = 'accent'
            let today = new Date()
            if (endTime >= today || (today.getTime() - endTime.getTime()) / 86400000 <= 3) {
              if (startTime.getTime() > today.getTime()) {
                status = 'primary'
              } else if (endTime.getTime() >= today.getTime()) {
                status = 'positive'
              }
              this.events[++this.count] = {
                name: campaign.name,
                startTime: campaign.start_time,
                endTime: campaign.end_time,
                status: status
              }
            }
          }
        })
    }
  }
}
</script>

<style>
.example-item {
  width: 480px;
}
</style>
