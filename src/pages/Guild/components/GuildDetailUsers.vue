<template>
  <div class="q-pa-md row items-start q-gutter-md justify-center justify-sm-start items-start">
    <GuildDetailUserCard
      v-for="item in users.operaters"
      :key="item.username"
      :user="item"
      :operater="true"
      :auth="item.username === users.owner.username? -1 : item.username === user.username ? 0 : auth"
      @refresh="refresh"
    />
    <GuildDetailUserCard
      v-for="item in users.users"
      :key="item.username"
      :user="item"
      :operater="false"
      :auth="item.username === user.username ? 0 : auth"
      @refresh="refresh"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import GuildDetailUserCard from 'pages/Guild/components/GuildDetailUserCard.vue'

@Component({
  components: {
    GuildDetailUserCard
  }
})
export default class GuildDetailUsers extends Vue {
  @Prop({ required: true }) users !: any
  @Prop({ required: true }) auth !: number

  get user () { return this.$store.state.user.data }

  created () {
    this.$emit('refresh')
  }

  refresh () {
    this.$emit('refresh')
  }
}
</script>
