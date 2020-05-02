<template>
  <el-dialog
  :title="title"
  :visible="visible"
  @close="close()"
  custom-class="select"
  >
    <div class="content">
      <div
        class="item"
        v-for="id in characters" :key="id"
        :disabled="disabled.indexOf(id) !== -1"
        :selected="multiple? selected.indexOf(id) !== -1 : true"
        @click="click(id)" :title="i18n.t('character.' + id)"
      >
        <img
          :src="characterIcon[id]"
          :alt="i18n.t('character.' + id)"
        >
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'
import characters from '@/assets/characters.json'
import characterIcon from '@/assets/character/index'

@Component
export default class Select extends Vue {
  @Model('selected') selected!: string[] | string
  @Prop({ default: () => { return [] } }) disabled!: string[]
  @Prop({ default: true }) multiple!: boolean
  @Prop({ default: 'select' }) title!: string
  @Prop({ default: false }) visible!: boolean
  characters = characters
  characterIcon = characterIcon
  i18n = window.i18n

  close () {
    this.$emit('close')
  }

  click (id: string) {
    if (!this.multiple) {
      this.$emit('selected', id)
      this.close()
    } else {
      let index = this.selected.indexOf(id)
      if (index !== -1) {
        (this.selected as string[]).splice(index, 1)
      } else {
        (this.selected as string[]).push(id)
      }
    }
  }
}
</script>

<style scoped>
.content {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.item {
  position: relative;
  height: 64px;
  width: 64px;
  margin: 2px;
  border-radius: 4px;
}

.item[disabled] {
  order: 1;
}

.item::after {
  content: "";
  position: absolute;
  height: 64px;
  width: 64px;
  top: 0;
  left: 0;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
}

.item[disabled]::after {
  background-color: rgba(255, 255, 255, 0.6) !important;
  cursor: auto;
}

.item[selected]::after {
  background-color: transparent;
}

img {
  height: 64px;
  width: 64px;
}
</style>

<style>
@media screen and (max-width: 720px) {
  .select {
    width: 90%;
  }
}

@media screen and (min-width: 720px) {
  .select {
    width: 70%;
  }
}
</style>
