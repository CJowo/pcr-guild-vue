<template>
  <div>
    <Calendar></Calendar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Calendar from 'components/Calendar.vue'
@Component({
  components: { Calendar }
})
export default class Index extends Vue {
}
</script>
