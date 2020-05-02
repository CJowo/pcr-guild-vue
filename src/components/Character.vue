<template>
  <div class="character">
    <img
        class="head"
        :src="characterIcon[character.id]"
        :alt="$t('character.' + character.id)" :title="$t('character.' + character.id)"
        :style="{ 'border-color': character.max ? 'gold' : 'transparent'}"
      >
      <div class="star">
        <img v-for="index in character.star" :key="index" src="@/assets/other/star.png" height="12px">
      </div>
      <div class="rank" v-if="character.rank">RANK {{ character.rank }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import characterIcon from '@/assets/character/index'

export interface Character {
  id: string;
  rank: number;
  star: number;
  max: boolean;
}

@Component
export default class CharacterComponent extends Vue {
  @Prop() character!: Character
  characterIcon = characterIcon
}
</script>

<style scoped>
.character {
  position: relative;
  min-height: 64px;
  width: 64px;
  margin: 4px;
}

.head {
  height: 64px;
  width: 64px;
  border: 2px solid;
  border-radius: 8px;
  border-color: transparent;
}

.star {
  position: absolute;
  top: 52px;
  height: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.rank {
  font-size: 12px;
  text-align: center;
}
</style>
