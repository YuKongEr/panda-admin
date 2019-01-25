<template>
  <div>
    <div class="search-container">
      <div class="search-inp-container">
        <el-input @keyup.enter.native="searchHandle" placeholder="" v-model="table.query.tableName" clearable>
        </el-input>
      </div>
      <el-button v-if="sys_gen_select" class="search-btn" type="primary" icon="el-icon-search" @click="getData">查询</el-button>
      <el-button v-if="sys_gen_download" class="search-btn" @click="exportCodeZipHandle">
        <svg-icon icon-class="download"></svg-icon> 下载
      </el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" @selection-change="selectChangeHandle" border highlight-current-row fit>
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column align="center" label="表名" prop="tableName"></el-table-column>
      <el-table-column align="center" label="表备注" prop="tableComment"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>
      <el-table-column align="center" label="操作" v-if="sys_gen_download">
        <template slot-scope="scope">
          <el-button class="search-btn" @click="openGenConfigDialogHandle(scope.row.tableName)">
            <svg-icon icon-class="download"></svg-icon> 下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="table.query.current" :page-size="table.query.size" :total="table.total" layout="prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog title="代码生成配置" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="table.param" label-width="140px" label-position="right">
        <el-form-item label="生成类型" prop="genType">
          <el-select style=" width: 420px;" v-model="table.param.genType" placeholder="请选择">
            <el-option v-for="item in genTypeOptions" :key="item.key" :label="item.key" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="entity包名称" prop="packageName">
          <el-input v-model="table.param.packageName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>
        <el-form-item label="query包名称" prop="queryPackageName">
          <el-input v-model="table.param.queryPackageName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>
        <el-form-item label="mapper包名称" prop="mapperPackageName" v-if="table.param.genType == 'mybatis'">
          <el-input v-model="table.param.mapperPackageName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>
        <el-form-item label="dao包名称" prop="daoPackageName" v-if="table.param.genType == 'ibatis'">
          <el-input v-model="table.param.daoPackageName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>
        <el-form-item label="serviceApi包名称" prop="serviceApiPackageName" v-if="table.param.genType == 'ibatis'">
          <el-input v-model="table.param.serviceApiPackageName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>

        <el-form-item label="service包名称" prop="servicePackageName">
          <el-input v-model="table.param.servicePackageName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>
        <el-form-item label="controller包名称" prop="controllerPackageName" v-if="table.param.genType == 'mybatis'">
          <el-input v-model="table.param.controllerPackageName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>
        <el-form-item label="作者名称" prop="authorName">
          <el-input v-model="table.param.authorName" placeholder="若为空，则加载默认配置"></el-input>
        </el-form-item>
      </el-form> <span slot="footer">
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button @click="exportCodeZipHandle" type="primary">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { fetchTableList, exportCodeZip } from '@/api/code'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      genTypeOptions: [
        {
          key: 'mybatis',
          value: 'mybatis'
        },
        {
          key: 'ibatis',
          value: 'ibatis'
        }
      ],
      dialogShow: false,
      dialogLoading: false,
      table: {
        loading: false,
        data: [
          {
            tableName: '',
            tableComment: '',
            createTime: undefined
          }
        ],
        query: {
          tableName: '',
          size: 10,
          current: 1
        },
        total: 0,
        selectTableNames: [],
        param: {
          packageName: '',
          servicePackageName: '',
          mapperPackageName: '',
          controllerPackageName: '',
          daoPackageName: '',
          queryPackageName: '',
          serviceApiPackageName: '',
          authorName: '',
          genType: 'mybatis',
          tableName: []
        }
      },
      sys_gen_select: false,
      sys_gen_download: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getData()
    this.sys_gen_select = this.permissions['/gen/code:select']
    this.sys_gen_download = this.permissions['/gen/code:download']
  },
  methods: {
    async getData() {
      this.table.loading = true
      const res = await fetchTableList(this.table.query)
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
      this.table.query.tableName = ''
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
    selectChangeHandle(val) {
      this.table.selectTableNames = val.map(v => v.tableName)
      this.table.param.tableName = this.table.selectTableNames
    },
    openGenConfigDialogHandle(tableName) {
      this.table.param.tableName = []
      this.table.param.tableName.push(tableName)
      this.dialogShow = true
    },
    exportCodeZipHandle() {
      exportCodeZip(this.table.param).then(res => {
        this.dialogShow = false
        const content = res
        const blob = new Blob([content])
        const fileName = 'code.zip'
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
