<template>
  <q-card class="q-mt-md">
    <q-card-section class="row justify-between">
      <q-chip outline color="primary" text-color="white" icon="account_circle" style="cursor: pointer" >
        {{ item.nickname }}
        <q-popup-proxy>
            <UserCard :user="item"/>
        </q-popup-proxy>
      </q-chip>
      <span class="text-h6">
        <q-toggle
          v-model="detail"
          color="primary"
        />
      </span>
    </q-card-section>
    <q-card-section class="row q-gutter-xs items-start" @click="detail=true">
      <Character
        v-for="character in item.characters"
        :key="character.name" :name="character.name"
        :star="character.star" :rank="character.rank"
        :exclusive="character.exclusive"
        :size="detail? 64 : 32"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Character from 'components/Character.vue'
import UserCard from 'components/UserCard.vue'

@Component({
  components: {
    Character,
    UserCard
  }
})
export default class GuildDetailBoxCard extends Vue {
  @Prop() item !: any
  detail = false
}
</script>
