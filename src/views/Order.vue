<template>
  <div v-loading="loading">
    <!-- 角色筛选 -->
    <span style="font-size: 14px; margin-right: 8px;">{{ $t('order.only') }}</span>
    <el-button @click="selectOnlyVisible=true" type="primary">{{ $t('order.select') }}</el-button>
    <div
      :title="only.map((val) => { return $t('character.' + val) }).join(' | ')"
      style="margin: 4px 0;"
    >
      <img
        v-for="id in only" :key="id"
        :src="characterIcon[id]"
        :alt="$t('character.' + id)"
        height="32px" width="32px"
        style="margin: 2px;"
      >
    </div>
    <!-- 过滤器 -->
    <el-table :data="filter">
      <el-table-column :label="$t('order.filter')">
        <template slot-scope="scope">
          <span>
            {{ $t('order.' + scope.row.method) }}
          </span>
          <span
            :title="scope.row.characters.map((val) => { return $t('character.' + val) }).join(' | ')"
            style="vertical-align: middle;"
          >
            <img
              v-for="id in scope.row.characters" :key="id"
              :src="characterIcon[id]"
              :alt="$t('character.' + id)"
              height="32px" width="32px"
              style="margin: 2px;"
            >
          </span>
        </template>
      </el-table-column>
      <el-table-column width="100px">
        <template slot="header">
          <el-button type="primary" @click="addFilterVisible = true">{{ $t('order.addfilter') }}</el-button>
        </template>
        <template slot-scope="scope">
          <el-button type="danger" @click="filter.splice(scope.$index, 1)">
            {{ $t('order.removefilter') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 成员显示 -->
    <el-table :data="show">
      <el-table-column :label="`ID(${ show.length })`" width="200px" prop="id" />
      <el-table-column label="Level" width="100px" prop="level" />
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <span style="margin-right: 8px">Box</span>
          <el-switch v-model="normalBox"></el-switch>
        </template>
        <template slot-scope="scope">
          <span v-if="normalBox">
            <span style="display: inline-block" v-for="item in scope.row.box" :key="item.id">
              <character v-if="only.indexOf(item.id) !== -1" :character="item" />
            </span>
          </span>
          <span
            :title="scope.row.box.map((val) => { return $t('character.' + val.id) }).join(' | ')"
            style="vertical-align: middle;" v-if="!normalBox"
          >
            <span v-for="item in scope.row.box" :key="item.id">
              <img
                v-if="only.indexOf(item.id) !== -1"
                :src="characterIcon[item.id]"
                :alt="$t('character.' + item.id)"
                height="32px" width="32px"
                style="margin: 2px;"
              >
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色筛选选择器 -->
    <character-select
      v-model="only"
      :visible="selectOnlyVisible"
      @close="selectOnlyVisible=false"
    />
    <!-- 过滤器添加 -->
    <el-dialog
      :title="$t('order.addfilter')"
      :visible.sync="addFilterVisible"
      width="70%"
      @closed="filterDialog = { method: 'and', characters: [] }"
    >
      <div>
        <el-select v-model="filterDialog.method" placeholder="请选择" style="margin-right: 8px;">
          <el-option :label="$t('order.and')" value="and" />
          <el-option :label="$t('order.or')" value="or" />
        </el-select>
        <el-button @click="selectVisible=true" type="primary">{{ $t('order.select') }}</el-button>
        <div
          :title="filterDialog.characters.map((val) => { return $t('character.' + val) }).join(' | ')"
          style="margin: 4px 0;"
        >
          <img
            v-for="id in filterDialog.characters" :key="id"
            :src="characterIcon[id]"
            :alt="$t('character.' + id)"
            height="32px" width="32px"
            style="margin: 2px;"
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFilterVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="addFilter()">{{ $t('primary') }}</el-button>
      </span>
    </el-dialog>
    <character-select
      v-model="filterDialog.characters"
      :visible="selectVisible"
      @close="selectVisible=false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import characterSelect from '@/components/Select.vue'
import characterIcon from '@/assets/character/index'
import CharacterCompoment from '@/components/Character.vue'

interface User {
  username: string;
  superuser: boolean;
  staff: boolean;
  id: string;
  level: number;
  box: { id: string }[];
}

@Component({
  components: {
    'character-select': characterSelect,
    character: CharacterCompoment
  }
})
export default class Order extends Vue {
  loading = true
  characterIcon = characterIcon
  selectOnlyVisible = false
  selectVisible = false
  addFilterVisible = false
  normalBox = true
  only: string[] = []
  filter: { method: string; characters: string[] }[] = []
  user: User | {} = {}
  raw: User[] = []
  show: User[] = []
  filterDialog = {
    method: 'and',
    characters: []
  }

  created () {
    this.load()
  }

  load () {
    Promise.all([
      this.$Http.get_detail_all()
        .then(response => {
          this.raw = response.data
          this.filteData()
        })
        .catch(() => {
          this.$alert(window.i18n.t('error.failed') as string, '', {
            showClose: false,
            showConfirmButton: false
          })
        }),
      this.$Http.get_detail()
        .then(response => {
          this.user = response.data
        })
        .catch(() => {
          this.$alert(window.i18n.t('error.failed') as string, '', {
            showClose: false,
            showConfirmButton: false
          })
        })
    ]).finally(() => { this.loading = false })
  }

  addFilter () {
    this.filter.push(this.filterDialog)
    this.addFilterVisible = false
  }

  @Watch('filter', { deep: true })
  onFilterChange () {
    this.filteData()
  }

  filteData () {
    let temp: User[] = []
    Object.assign(temp, this.raw)
    for (let i in this.filter) {
      let del = []
      switch (this.filter[i].method) {
        case 'and':
          del = this.filterAnd(temp, this.filter[i].characters)
          break
        case 'or':
          del = this.filterOr(temp, this.filter[i].characters)
          break
      }
      for (let j in del) temp.splice(del[j] - parseInt(j), 1)
    }
    this.show = temp
  }

  filterAnd (val: User[], characters: string[]): any[] {
    let res: any[] = []
    for (let i in val) {
      let box = val[i].box.map((val: any) => { return val.id })
      let del = false
      for (let j in characters) {
        if (box.indexOf(characters[j]) === -1) {
          del = true
          break
        }
      }
      if (del) res.push(i)
    }
    return res
  }

  filterOr (val: User[], characters: string[]): any[] {
    let res: any[] = []
    for (let i in val) {
      let box = val[i].box.map((val: any) => { return val.id })
      let del = true
      for (let j in characters) {
        if (box.indexOf(characters[j]) !== -1) {
          del = false
          break
        }
      }
      if (del) res.push(i)
    }
    return res
  }
}
</script>

<style scoped>

</style>
