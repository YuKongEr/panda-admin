/*
 * @Author: yukong 
 * @Date: 2018-12-04 14:29:10 
 * @Last Modified by: yukong
 * @Last Modified time: 2019-01-22 17:40:07
 */

<template>
  <div>
    <div class="search-container">
      <el-button
        class="search-btn"
        :autofocus="true"
        icon="el-icon-refresh"
        @click="refreshHandle"
      >刷新</el-button>
    </div>
    <el-table
      v-loading="table.loading"
      :data="table.data"
      :default-sort="{prop : 'roleName', prop: 'roleCode'}"
      border
      highlight-current-row
      fit
    >
      <el-table-column
        fixed
        align="center"
        type="index"
        width="50"
      ></el-table-column>
      <el-table-column
        align="center"
        label="用户id"
        prop="userId"
      ></el-table-column>
      <el-table-column
        align="center"
        label="用户名"
        prop="userName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="令牌"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.access_token"
            placement="top"
          >
            <span style="display:inline-block;overflow:hidden;height:50px"> {{scope.row.access_token}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="范围"
        prop="scope"
      ></el-table-column>
      <el-table-column
        align="center"
        label="过期时间"
        prop="expires_in"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="操作"
        v-if="sys_token_index_delete"
      >
        <template slot-scope="scope">
          <el-button
            type="danger"
            @click="deleteHandle(scope.row.access_token)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-show="!table.loading"
      class="footer"
    >
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page.sync="table.query.current"
        :page-size="table.query.size"
        :total="table.total"
        :page-sizes="[10, 40, 80, 100]"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchTokenPage, deleteToken } from '@/api/token'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      dialogFormVisible: false,
      exceptionMsg: '',
      table: {
        data: [{
          userId: null,
          userName: null,
          access_token: '',
          expires_in: '',
          scope: null,
          token_type: null
        }],
        query: {
          size: 10,
          current: 1
        },
        total: 0,
        loading: true
      },
      props: {
        label: 'name'
      },
      checkedIds: [],
      sys_token_index_delete: false
    }
  },
  mounted() {
    this.getData()
    this.sys_token_index_delete = this.permissions['/admin/token/index:delete']
  },
  computed: {
    ...mapGetters(['permissions']),
    ...mapGetters(['token'])
  },
  methods: {
    async getData() {
      this.table.loading = true
      const res = await fetchTokenPage(this.table.query)
      if (res.code === 0) {
        this.table.data = res.data.records
        this.table.total = res.data.total
      } else {
        this.$message.error('查询错误！')
      }
      this.table.loading = false
    },
    refreshHandle() {
      this.table.query.size = 10
      this.table.query.current = 1
      this.getData()
    },
    dateFormat(row, column) {
      const date = row[column.property]
      if (!date) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },

    sizeChangeHandle(val) {
      this.table.query.size = val
      this.getData()
    },

    currentChangeHandle(val) {
      this.table.query.current = val
      this.getData()
    },
    deleteHandle(id) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteToken(id)
        if (res.code === 0) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          // 如果删除的是自己token  则退出系统
          if (id === this.token) {
            this.$store.dispatch('FedLogOut').then(() => {
              this.$notify({
                title: '警告',
                message: '当前登录信息已失效，请重新登录',
                type: 'warning'
              })
              this.$router.push({ name: 'login' })
            })
          } else {
            // 重新刷新表格
            this.getData()
          }
        } else {
          this.$message.error('删除失败！')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
