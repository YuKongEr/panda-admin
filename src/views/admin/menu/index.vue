<template>
  <div>
    <div class="search-container">
      <el-button class="search-btn" type="primary" icon="el-icon-plus" @click="openDialog(undefined)" v-if="sys_resource_add">添加</el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="getData">刷新</el-button>
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
      <el-table-column label="资源权限" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.permission}}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求url" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.url | formatText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方法" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件路径">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.component}}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源图标" align="center">
        <template slot-scope="scope" align="center">
          <span>
            <svg-icon :icon-class="scope.row.icon" />
            <span v-if="scope.row.icon == '' || scope.row.icon == null">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" v-if="sys_resource_add || sys_resource_update || sys_resource_delete">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="mb5" @click="openDialog(scope.row.id)" icon="el-icon-plus" v-if="scope.row.type == 0 && sys_resource_add"></el-button>
          <el-button type="success" size="mini" class="ml10" @click="openEditDialog(scope.row.id)" icon="el-icon-edit" v-if="sys_resource_update"></el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.id)" icon="el-icon-delete" v-if="sys_resource_delete"></el-button>
        </template>
      </el-table-column>
    </tree-table>

    <!-- 添加菜单信息 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" :before-close="closeHandle" width="600px" :close-on-click-modal="false">
      <div class="dialog-container">
        <el-alert class="alert" title="为方便操作，添加时[权限标识/组件路径]会自动继承父级的资源属性" type="info" center show-icon></el-alert>
        <el-form ref="resourceForm" :model="dialog.data" :rules="dialog.rules" label-width="80px" label-position="right">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="dialog.data.name" placeholder="请输入资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-select class="form-select" v-model="dialog.data.type" placeholder="请选择资源类型">
              <el-option label="菜单" value="0"></el-option>
              <el-option label="按钮" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源链接" prop="path">
            <el-input v-model="dialog.data.path" placeholder="请输入资源链接"></el-input>
          </el-form-item>
          <el-form-item label="资源权限" prop="permission">
            <el-input v-model="dialog.data.permission" placeholder="请输入资源权限"></el-input>
          </el-form-item>
          <el-form-item label="请求url" prop="path">
            <el-input v-model="dialog.data.url" placeholder="请输入请求url"></el-input>
          </el-form-item>

          <el-form-item label="请求方法" prop="type">
            <el-select class="form-select" v-model="dialog.data.method" placeholder="请选择请求方法">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="PATCH" value="PATCH"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
              <el-option label="POST" value="POST"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="dialog.data.component" placeholder="请输入组件路径"></el-input>
          </el-form-item>
          <el-form-item label="资源图标" prop="icon">
            <el-input v-model="dialog.data.icon" placeholder="请输入资源图标"></el-input>
          </el-form-item>
          <el-form-item label="排序权重" prop="sort">
            <el-input v-model="dialog.data.sort" placeholder="请输入排序权重"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show=false">取消</el-button>
        <el-button type="primary" @click="submitHandle">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllReource,
  saveReource,
  getResourceById,
  updateReource,
  deleteResourceById
} from '@/api/menu.js'

import treeTable from '@/components/TreeTable'

import { mapGetters } from 'vuex'

export default {
  components: {
    treeTable
  },
  data() {
    return {
      expandAll: false,
      columns: [
        {
          text: '菜单名称',
          value: 'name'
        }
      ],
      data: [],
      dialog: {
        title: '添加资源信息',
        show: false,
        data: {
          id: null,
          name: '',
          type: null,
          path: '',
          permission: '',
          component: '',
          icon: '',
          sort: 100,
          parentId: -1
        },
        rules: {
          name: [
            {
              required: true,
              message: '资源名称不能为空',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '资源类型不能为空',
              trigger: 'change'
            }
          ]
        }
      },
      sys_resource_add: false,
      sys_resource_update: false,
      sys_resource_select: false,
      sys_resource_delete: false
    }
  },
  filters: {
    formatText(value) {
      if (!value || value === '') {
        return '-'
      }
      return value
    }
  },
  computed: {
    successMessage() {
      if (this.dialog.data.id) {
        return '修改成功！'
      } else {
        return '添加成功'
      }
    },
    failMessage() {
      if (this.dialog.data.id) {
        return '修改失败！'
      } else {
        return '添加失败'
      }
    },
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getData()

    this.sys_resource_add = this.permissions['/admin/menu:add']
    this.sys_resource_delete = this.permissions['/admin/menu:delete']
    this.sys_resource_select = this.permissions['/admin/menu:select']
    this.sys_resource_update = this.permissions['/admin/menu:update']
  },
  methods: {
    async getData() {
      const response = await getAllReource()
      this.data = response.data
    },
    async openEditDialog(id) {
      this.dialog.title = '编辑资源信息'
      // 清除dialog中的数据
      this.clearDialogData()
      const res = await getResourceById(id)
      if (res.code === 0) {
        this.dialog.data = res.data
        this.dialog.data.id = res.data.id
      } else {
        this.$message.error('数据载入失败')
      }
      this.dialog.show = true
    },
    submitHandle() {
      this.$refs['resourceForm'].validate(async valid => {
        if (valid) {
          let res = null
          // 存在id 更新操作 否则就是 新增
          if (this.dialog.data.id) {
            res = await updateReource(this.dialog.data)
          } else {
            res = await saveReource(this.dialog.data)
          }
          if (res.code === 0) {
            this.$message({
              message: this.successMessage,
              type: 'success'
            })
            // todo: 重刷router  有bug 需修复
            // this.$store.dispatch('GetMenu').then(data => {
            //   initMenu(this.$router, data)
            // })
            this.dialog.show = false
            // 重新刷新表格
            this.getData()
            // 清除dialog中的数据
            this.clearDialogData()
            // 重置表单校验状态
            this.$refs['resourceForm'].resetFields()
          } else {
            this.$message.error(this.failMessage)
          }
        } else {
          return false
        }
      })
    },
    deleteHandle(id) {
      this.$confirm('此操作将一并删除其子节点资源，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteResourceById(id)
        if (res.code === 0) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          // 重新刷新表格
          this.getData()
        } else {
          this.$message.error('删除失败！')
        }
      })
    },
    closeHandle(done) {
      done()
    },
    async openDialog(id) {
      this.dialog.title = '添加资源信息'
      // 清除dialog中的数据
      this.clearDialogData()
      if (id === '' || id === undefined || id === undefined) {
        // 代表顶级目录 所以父节点为 -1
        this.dialog.data.parentId = -1
        this.dialog.show = true
      } else {
        const res = await getResourceById(id)
        if (res.code === 0) {
          this.dialog.data.parentId = res.data.id
          this.dialog.data.component = res.data.component
          this.dialog.data.permission = res.data.permission
        } else {
          this.$message.error('数据载入失败')
        }
      }
      this.dialog.show = true
    },
    clearDialogData() {
      this.dialog.data.id = null
      this.dialog.data.name = null
      this.dialog.data.type = null
      this.dialog.data.path = null
      this.dialog.data.permission = null
      this.dialog.data.component = null
      this.dialog.data.icon = null
      this.dialog.data.sort = 1
      this.dialog.data.parentId = -1
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-container {
  .alert {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .form-select {
    width: 100%;
  }
}
</style>


