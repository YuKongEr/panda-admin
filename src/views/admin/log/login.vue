<template>
  <div>
    <div class="search-container">
      <el-input v-if="sys_log_login_select" placeholder="请输入用户名" v-model="table.query.createBy" style="width:200px" @keyup.enter.native="getData" clearable />
      <el-select v-if="sys_log_login_select" v-model="table.query.status" placeholder="请选择状态">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button v-if="sys_log_login_select" class="search-btn" type="primary" icon="el-icon-search" @click="getData">查询</el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" :default-sort="{prop : 'roleName', prop: 'roleCode'}" border highlight-current-row fit>
      <el-table-column fixed align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="用户名" prop="createBy"></el-table-column>
      <el-table-column align="center" label="操作名称" prop="actionName"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" size="success">成功</el-tag>
          <el-tag v-if="scope.row.status == 1" size="danger">失败</el-tag>

        </template>
      </el-table-column>
      <el-table-column align="center" label="操作ip" prop="remoteAddr"></el-table-column>
      <el-table-column align="center" label="User-Agent">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.userAgent" placement="top">
            <span style="display:inline-block;overflow:hidden;height:50px"> {{scope.row.userAgent}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>

    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="table.query.current" :page-size="table.query.size" :total="table.total" :page-sizes="[10, 40, 80, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog title="异常信息" :visible.sync="dialogFormVisible" width="70%">
      <div v-html="exceptionMsg"></div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchLogPage } from '@/api/log'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      options: [{
        value: '0',
        label: '成功'
      }, {
        value: '1',
        label: '失败'
      }],
      dialogFormVisible: false,
      exceptionMsg: '',
      table: {
        data: [{
          createBy: null,
          serviceId: '',
          moduleName: '',
          actionName: null,
          modifyTome: null,
          time: null,
          requestUri: '',
          remoteAddr: '',
          remote_addr: null,
          createTime: null,
          status: '',
          exception: ''
        }],
        query: {
          size: 10,
          current: 1,
          createBy: '',
          type: '0',
          status: ''
        },
        total: 0,
        loading: true
      },
      props: {
        label: 'name'
      },
      checkedIds: [],
      sys_log_login_select: false
    }
  },
  mounted() {
    this.getData()
    this.sys_log_login_select = this.permissions['/admin/log/login:select']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    async getData() {
      this.table.loading = true
      const res = await fetchLogPage(this.table.query)
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
      this.table.query.createBy = ''
      this.table.query.status = ''
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
    openExceptionDialog(msg) {
      this.exceptionMsg = msg
      this.dialogFormVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
