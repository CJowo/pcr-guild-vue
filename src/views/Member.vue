<template>
  <div v-loading="loading">
    <el-table :data="member">
      <el-table-column :label="`ID (${member.length})`" width="200px">
        <template slot-scope="scope">
          <i class="el-icon-s-custom" v-if="scope.row.superuser" />
          <i class="el-icon-star-off" v-if="!scope.row.superuser && scope.row.staff" />
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="Level" width="80px" :sortable="true" />
      <el-table-column label="Box" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>
            <span style="font-size: 0;">
              {{ scope.row.box.map((val) => { return $t('character.' + val.id) }).join(' | ') }}
            </span>
            <img
              v-for="item in scope.row.box" :key="item.id"
              :src="characterIcon[item.id]"
              :alt="$t('character.' + item.id)"
              height="32px" width="32px"
            >
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="user.superuser || user.staff" min-width="200px">
        <template slot-scope="scope">
          <span v-if="scope.row.username !== user.username">
            <el-button type="danger" size="small" @click="remove(scope.row)">
              {{ $t('member.remove') }}
            </el-button>
            <el-button type="primary" size="small" v-if="user.superuser" @click="staff(scope.row)" >
              {{ scope.row.staff? $t('member.removestaff'): $t('member.setstaff') }}
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import characterIcon from '@/assets/character/index'

interface User {
  username: string;
  superuser: boolean;
  staff: boolean;
  id: string;
  level: number;
  box: { id: string }[];
}

@Component
export default class Member extends Vue {
  characterIcon = characterIcon
  user: User | {} = {}
  member: User[] = []
  loading = true

  created () {
    this.load()
  }

  load () {
    Promise.all([
      this.$Http.get_detail_all()
        .then(response => {
          this.member = response.data
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

  remove (user: User) {
    this.$confirm(
      window.i18n.t('member.removeconfirm') as string + `: ${user.id}(${user.username})`,
      window.i18n.t('member.remove') as string,
      {
        confirmButtonText: window.i18n.t('primary') as string,
        cancelButtonText: window.i18n.t('cancel') as string,
        type: 'warning'
      })
      .then(() => {
        this.loading = true
        this.$Http.remove(user.username)
          .then(() => { this.load() })
          .catch(() => { this.loading = false })
      })
  }

  staff (user: User) {
    this.loading = true
    this.$Http.set_staff(user.username, !user.staff)
      .then(() => { this.load() })
      .catch(() => { this.loading = false })
  }
}
</script>

<style>

</style>
