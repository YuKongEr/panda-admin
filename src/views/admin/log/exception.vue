<template>
  <div>
    <div class="search-container">
      <el-input v-if="sys_log_exception_select" placeholder="请输入模块名称" v-model="table.query.moduleName" style="width:200px" @keyup.enter.native="getData" clearable />
      <el-button v-if="sys_log_exception_select" class="search-btn" type="primary" icon="el-icon-search" @click="getData">查询</el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" :default-sort="{prop : 'roleName', prop: 'roleCode'}" border highlight-current-row fit>
      <el-table-column fixed align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="服务id" prop="serviceId"></el-table-column>
      <el-table-column align="center" label="模块名称" prop="moduleName"></el-table-column>
      <el-table-column align="center" label="操作名称" prop="actionName"></el-table-column>
      <el-table-column align="center" label="操作ip" prop="remoteAddr"></el-table-column>
      <el-table-column align="center" label="请求参数" prop="params" width="150">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.params" placement="top">
            <span style="display:inline-block;overflow:hidden;height:50px"> {{scope.row.params}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="User-Agent">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.userAgent" placement="top">
            <span style="display:inline-block;overflow:hidden;height:50px"> {{scope.row.userAgent}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="info" @click="openExceptionDialog(scope.row.exception)">异常信息</el-button>

        </template>
      </el-table-column>
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
  data () {
    return {
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
          moduleName: '',
          status: '1'
        },
        total: 0,
        loading: true
      },
      props: {
        label: 'name'
      },
      checkedIds: [],
      sys_log_exception_select: false
    }
  },
  mounted () {
    this.getData()
    this.sys_log_exception_select = this.permissions['/admin/log/exception:select']
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    async getData () {
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
    refreshHandle () {
      this.table.query.size = 10
      this.table.query.current = 1
      this.table.query.moduleName = ''
      this.getData()
    },
    dateFormat (row, column) {
      const date = row[column.property]
      if (!date) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },

    sizeChangeHandle (val) {
      this.table.query.size = val
      this.getData()
    },

    currentChangeHandle (val) {
      this.table.query.current = val
      this.getData()
    },
    openExceptionDialog (msg) {
      this.exceptionMsg = msg
      this.dialogFormVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
