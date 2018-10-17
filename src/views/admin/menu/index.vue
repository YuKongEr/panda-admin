<template>
  <div>
    <div class="search-container">
      <el-button class="search-btn" type="success">查询</el-button>
      <el-button class="search-btn" type="warning">添加</el-button>
    </div>

    <tree-table :data="data" :expand-all="expandAll" :columns="columns" border>

      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">
            <svg-icon icon-class="panda-menu" />&nbsp;菜单
          </span>
          <span v-if="scope.row.type == 1">
            <svg-icon icon-class="panda-button" />&nbsp;按钮
          </span>
        </template>
      </el-table-column>
      <el-table-column label="资源链接" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.path | formatText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.permission}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件路径">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.component}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="scope" align="center">
          <span>
            <svg-icon :icon-class="scope.row.icon" />
            <span v-if="scope.row.icon == '' || scope.row.icon == null">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="170">
        <template slot-scope="scope">
          <el-button type="success" size="mini" class=" mb5">添加子项</el-button>
          <el-button type="primary" size="mini" class="ml10">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>


  </div>
</template>
<script>
  import {
    getAllReource
  } from '@/api/menu.js'
  import treeTable from '@/components/TreeTable'
  export default {
    components: {
      treeTable
    },
    data() {
      return {
        expandAll: false,
        columns: [{
          text: '菜单名称',
          value: 'name',
        }],
        data: []
      }
    },
    filters: {
      formatText(value) {
        if (!value || value == "") {
          return "-";
        }
        return value;
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      async getData() {
        let response = await getAllReource();
        this.data = response.data;
      },
      message(row) {
        this.$message.info(row.event)
      }
    }
  }

</script>
<style scoped>


</style>
