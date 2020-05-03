<template>
  <div v-loading="loading">
    <el-form
      :model="info" label-position="left"
      :inline="true" label-width="auto"
      v-loading="infoLoading" ref="infoForm"
    >
      <el-form-item label="ID" prop="id"
        :rules="[
          { required: true, message: $t('error.required') },
          { max: 16, min: 1, message: $t('error.range') + ' 1~16' }
        ]"
      >
        <el-input v-model="info.id" @change="changeInfo()" />
      </el-form-item>
      <el-form-item label="Level" prop="level"
        :rules="[
          { required: true, message: $t('error.required') },
          { max: maxLevel, min: 1, type: 'number', message: $t('error.range') + ' 1~' + maxLevel }
        ]"
      >
        <el-input v-model.number="info.level" @change="changeInfo()" />
      </el-form-item>
    </el-form>
    <div class="content">
      <span v-for="(character, index) in box" :key="character.id" @click="boxIndex = index">
        <character :character="character" />
      </span>
      <span @click="selectVisible=true" style="margin: 4px; cursor: pointer">
        <img src="@/assets/other/add.png" height="68px" width="68px">
      </span>
      <character-select
        v-model="selected" :visible="selectVisible"
        @close="selectVisible=false" :disabled="characters"
        :multiple="false" :title="$t('dialog.select')"
      />
      <el-dialog
        :title="$t('character.' + character.id)"
        :visible.sync="editVisible"
        :close-on-click-modal="false"
        v-loading="editLoading"
      >
        <el-form label-position="right" ref="edit" :model="character">
          <el-form-item :label="$t('box.edit.star')" prop="star"
            :rules="[
              { required: true, message: $t('error.required') },
              { type: 'number', min: 1, max: 5, message: $t('error.range') + ' 1~5' },
            ]"
          >
            <el-input v-model.number="character.star" />
          </el-form-item>
          <el-form-item label="RANK" prop="rank"
            :rules="[
              { required: true, message: $t('error.required') },
              { type: 'number', min: 1, max: maxRank, message: $t('error.range') + ' 1~' + maxRank },
            ]"
          >
            <el-input v-model.number="character.rank" />
          </el-form-item>
          <el-form-item :label="$t('box.edit.max')">
            <el-switch v-model="character.max" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="remove()">{{ $t('box.edit.remove') }}</el-button>
          <el-button type="primary" @click="edit()">{{ $t('primary') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import CharacterComponent, { Character } from '@/components/Character.vue'
import Select from '@/components/Select.vue'
import { maxLevel, maxRank } from '@/utils/data'

@Component({
  components: {
    character: CharacterComponent,
    'character-select': Select
  }
})
export default class Box extends Vue {
  maxLevel = maxLevel
  maxRank = maxRank
  info: { id: string; level: number } = { id: '', level: 0 }
  box: Character[] = []
  selected: null | string = null
  selectVisible = false
  editVisible = false
  editLoading = false
  boxIndex = -1
  character: Character = {
    id: 'kyaru',
    star: 1,
    rank: 1,
    max: false
  }

  loading = true
  infoLoading = false

  get characters () { return this.box.map((item: Character) => { return item.id }) }

  created () {
    this.$Http.get_detail()
      .then(response => {
        this.info.id = response.data.id
        this.info.level = response.data.level
        this.box = response.data.box
      })
      .catch(() => {
        this.$alert(window.i18n.t('error.failed') as string, '', {
          showClose: false,
          showConfirmButton: false
        })
      })
      .finally(() => { this.loading = false })
  }

  @Watch('selected')
  onSelectedChange (newValue: string) {
    if (newValue !== null) {
      this.loading = true
      this.$Http.character_add(newValue)
        .then(() => {
          this.box.push({
            id: newValue,
            rank: 8,
            star: 3,
            max: true
          })
        })
        .finally(() => { this.loading = false })
    }
  }

  @Watch('boxIndex')
  onBoxIndexChange (newValue: number) {
    if (newValue !== -1) {
      this.character = { ...this.box[this.boxIndex] }
      this.editVisible = true
    }
  }

  @Watch('editVisible')
  onEditVisibleChange (newValue: boolean) {
    if (!newValue) this.boxIndex = -1
  }

  changeInfo () {
    (this.$refs.infoForm as any).validate((valid: boolean) => {
      if (valid) {
        this.infoLoading = true
        this.$Http.set_detail(this.info.id, this.info.level)
          .finally(() => { this.infoLoading = false })
      } else {
        return false
      }
    })
  }

  edit () {
    (this.$refs.edit as any).validate((valid: boolean) => {
      if (valid) {
        this.editLoading = true
        this.$Http.character_edit(this.character)
          .then(() => {
            this.box[this.boxIndex] = this.character
            this.editVisible = false
          })
          .finally(() => { this.editLoading = false })
      } else {
        return false
      }
    })
  }

  remove () {
    this.editLoading = true
    this.$Http.character_remove(this.character.id)
      .then(() => {
        this.box.splice(this.boxIndex, 1)
        this.editVisible = false
      })
      .finally(() => { this.editLoading = false })
  }
}
</script>

<style scoped>
.content {
  position: relative;
  width: 100%;
  padding: 4px;
  border: #dddddd solid 1px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
}

.character {
  cursor: pointer;
}

.edit {
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
