<template>
  <div>
    <div class="search-container">
      <div class="search-inp-container">
        <el-input @keyup.enter.native="searchHandle" placeholder="" v-model="table.query.tableName" clearable>
        </el-input>
      </div>
      <el-button class="search-btn" type="primary" icon="el-icon-search" @click="getData">查询</el-button>
      <el-button class="search-btn">
        <svg-icon icon-class="download"></svg-icon> 下载
      </el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" @selection-change="selectChangeHandle" border highlight-current-row fit>
      <el-table-column align="center" type="selection" width="50"></el-table-column>
      <el-table-column align="center" label="表名" prop="tableName"></el-table-column>
      <el-table-column align="center" label="表备注" prop="tableComment"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button class="search-btn" @click="exportCodeZipHandle(scope.row.tableName)">
            <svg-icon icon-class="download"></svg-icon> 下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="table.query.current" :page-size="table.query.size" :total="table.total" layout="prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>
<script>

import moment from 'moment'
import { fetchTableList, exportCodeZip } from '@/api/code'

export default {
  data() {
    return {
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
          genType: 'ibatis',
          tableName: []
        }
      }
    }
  },
  mounted() {
    this.getData()
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
    },
    exportCodeZipHandle(tableName) {
      this.table.param.tableName = []
      this.table.param.tableName.push(tableName)
      exportCodeZip(this.table.param).then(res => {
        debugger
        const content = res
        const blob = new Blob([content])
        const fileName = 'code.zip'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
</style>
