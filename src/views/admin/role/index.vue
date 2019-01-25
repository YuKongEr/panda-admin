<template>
  <div>
    <div class="search-container">
      <el-input placeholder="请输入角色名称" v-model="table.query.roleName" style="width:200px" @keyup.enter.native="getData" clearable />
      <el-input placeholder="请输入角色代码" v-model="table.query.roleCode" style="width:200px" @keyup.enter.native="getData" clearable />
      <el-button class="search-btn" type="primary" icon="el-icon-search" @click="getData" v-if="sys_role_select">查询</el-button>
      <el-button class="search-btn" type="primary" icon="el-icon-plus" @click="openDialogHandle" v-if="sys_role_add">添加</el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" :default-sort="{prop : 'roleName', prop: 'roleCode'}" border highlight-current-row fit>
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="角色名称" prop="roleName"></el-table-column>
      <el-table-column align="center" label="角色代码" prop="roleCode"></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" :formatter="dateFormat"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" class=" mb5" @click="openDialog(scope.row.roleId)" icon="el-icon-search"></el-button>
          <el-button type="success" size="mini" class="ml10" @click="editDialogHandle(scope.row.roleId)" icon="el-icon-edit" v-if="sys_role_update"></el-button>
          <el-button type="danger" size="mini" @click="deleteHandle(scope.row.roleId)" icon="el-icon-delete" v-if="sys_role_delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="table.query.current" :page-size="table.query.size" :total="table.total" :page-sizes="[10, 40, 80, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" width="600px" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="dialog.data" :rules="dialog.rules" label-width="80px" label-position="right">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dialog.data.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="dialog.data.roleCode" placeholder="请输入角色代码"></el-input>
        </el-form-item>
        <el-form-item label="权限集合">
          <el-tree ref="permissionTree" :data="permissionTree" show-checkbox node-key="id" :props="props" default-expand-all :default-checked-keys="checkedIds">
          </el-tree>
        </el-form-item>
      </el-form> <span slot="footer">
        <el-button @click="dialog.show = false">取消</el-button>
        <el-button @click="submitHandle" type="primary" :loading="dialog.loading">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchRolePage,
  getRoleInfoById,
  saveRole,
  updateRole,
  deleteRoleInfoById
} from '@/api/role'
import { getAllReource } from '@/api/menu'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      table: {
        data: [
          {
            roleId: null,
            roleCode: '',
            roleName: '',
            createTime: null,
            modifyTome: null,
            sysResurceIds: []
          }
        ],
        query: {
          size: 10,
          current: 1,
          roleCode: '',
          roleName: ''
        },
        total: 0,
        loading: true
      },
      dialog: {
        loading: false,
        title: '添加角色',
        data: {
          roleId: null,
          roleCode: '',
          roleName: '',
          createTime: null,
          modifyTome: null,
          sysResourceIds: []
        },
        show: false,
        rules: {
          roleName: [
            {
              required: true,
              message: '角色名称不能为空',
              trigger: 'blur'
            }
          ],
          roleCode: [
            {
              required: true,
              message: '角色代码不能为空',
              trigger: 'blur'
            }
          ]
        }
      },
      permissionTree: [],
      props: {
        label: 'name'
      },
      checkedIds: [],
      sys_role_add: false,
      sys_role_update: false,
      sys_role_delete: false,
      sys_role_select: false
    }
  },
  mounted() {
    this.getData()
    this.sys_role_add = this.permissions['/admin/role:add']
    this.sys_role_update = this.permissions['/admin/role:update']
    this.sys_role_delete = this.permissions['/admin/role:delete']
    this.sys_role_select = this.permissions['/admin/role:select']
  },
  computed: {
    successMessage() {
      if (this.dialog.data.roleId) {
        return '修改角色成功！'
      }
      return '添加角色成功！'
    },
    ...mapGetters(['permissions'])
  },
  methods: {
    async getData() {
      this.table.loading = true
      const res = await fetchRolePage(this.table.query)
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
      this.table.query.roleCode = ''
      this.table.query.roleName = ''
      this.getData()
    },
    dateFormat(row, column) {
      const date = row[column.property]
      if (!date) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    refresh() {
      this.table.query.roleCode = ''
      this.table.query.roleName = ''
      this.getData()
    },
    async openDialogHandle() {
      this.dialog.title = '添加角色信息'
      this.clearDialogData()
      const res = await getAllReource()
      this.permissionTree = res.data
      this.checkedIds = []
      this.dialog.show = true
    },
    async editDialogHandle(id) {
      this.dialog.title = '编辑角色信息'
      this.clearDialogData()
      // 先获取角色信息
      const roleRes = await getRoleInfoById(id)
      this.dialog.data = roleRes.data
      // 获取资源树信息
      const res = await getAllReource()
      this.permissionTree = res.data
      this.checkedIds = this.getAllLeafNodeId(
        this.permissionTree,
        this.dialog.data.sysResourceIds,
        []
      )
      this.dialog.show = true
    },
    getAllLeafNodeId(resourceTree, allIds, leafIds) {
      for (let i = 0; i < resourceTree.length; i++) {
        const resource = resourceTree[i]
        if (resource.children && resource.children.length !== 0) {
          this.getAllLeafNodeId(resource.children, allIds, leafIds)
        } else {
          leafIds.push(allIds.filter(id => id === resource.id))
        }
      }
      return leafIds
    },
    submitHandle() {
      this.$refs['roleForm'].validate(async valid => {
        if (valid) {
          this.dialog.loading = true
          const selectPermission = this.$refs['permissionTree']
            .getCheckedKeys()
            .concat(this.$refs['permissionTree'].getHalfCheckedKeys())
          this.dialog.data.sysResourceIds = selectPermission
          // 更新
          let res
          if (this.dialog.data.roleId) {
            res = await updateRole(this.dialog.data)
          } else {
            res = await saveRole(this.dialog.data)
          }
          if (res.code === 0) {
            this.$message({
              message: this.successMessage,
              type: 'success'
            })
            this.dialog.loading = false
            this.dialog.show = false
            this.getData()
            this.clearDialogData()
            // 重置表单校验状态
            this.$refs['roleForm'].resetFields()
          }
        }
      })
    },
    sizeChangeHandle(val) {
      this.table.query.size = val
      this.getData()
    },
    deleteHandle(id) {
      this.$confirm('是否删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteRoleInfoById(id)
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
    currentChangeHandle(val) {
      this.table.query.current = val
      this.getData()
    },
    clearDialogData() {
      this.dialog.data.roleId = null
      this.dialog.data.roleCode = null
      this.dialog.data.roleName = null
      this.dialog.data.sysResourceIds = []
      this.dialog.data.createTime = null
      this.dialog.data.modifyTime = null
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
