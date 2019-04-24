<template>
  <div>
    <div class="search-container">
      <el-input v-if="sys_client_select" placeholder="请输入服务名称" v-model="table.query.serviceId" style="width:200px" @keyup.enter.native="getData" clearable />
      <el-button v-if="sys_client_select" class="search-btn" type="primary" icon="el-icon-search" @click="getData">查询</el-button>
      <el-button v-if="sys_client_add" class="search-btn" type="primary" icon="el-icon-plus" @click="addHandle('form')">添加</el-button>

      <el-button v-if="sys_client_select" class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" :default-sort="{prop : 'roleName', prop: 'roleCode'}" border highlight-current-row fit>
      <el-table-column fixed align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="服务名称" prop="serviceId"></el-table-column>
      <el-table-column align="center" label="路由路径" prop="path"></el-table-column>
      <el-table-column align="center" label="是否去掉前缀">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.stripPrefix === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否重试">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.retryable === '1' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">

          <el-tag v-if=" scope.row.retryable === '1'">
            {{scope.row.delFlag | statusFilter}}
          </el-tag>
          <el-tag v-else type="danger">
            {{scope.row.delFlag | statusFilter}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="敏感信息" prop="sensitiveHeadersList"></el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="sys_client_view" size="mini" type="primary" @click="handleViewDict(scope.row.id)">查看</el-button>

          <el-button v-if="sys_client_update" size="mini" type="primary" @click="handleEditDict(scope.row.id)">编辑</el-button>
          <el-button v-if="sys_client_delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="table.query.current" :page-size="table.query.size" :total="table.total" :page-sizes="[10, 40, 80, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="45%">
      <el-alert class="alert" title="请谨慎操作,动态路由需要专业人员配置!" type="warning" center show-icon></el-alert>
      <br>
      <el-form :model="form" :rules="rules" ref="form" label-width="200px">

        <el-form-item label="服务名称" prop="serviceId">
          <el-input v-model="form.serviceId" placeholder="请输入服务名称" class="w300" v-bind:disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="路由路径" placeholder="请输入路由路径" prop="path">
          <el-input type="text" v-model="form.path" class="w300" v-bind:disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="是否去掉前缀" prop="stripPrefix">
          <el-select class="form-select w300" v-model="form.stripPrefix" placeholder="请选择" v-bind:disabled="isView">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否重试" prop="retryable">
          <el-select class="form-select w300" v-model="form.retryable" placeholder="请选择" v-bind:disabled="isView">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="敏感请求头" placeholder="请输入敏感请求头" prop="sensitiveHeadersList">
          <el-input type="text" v-model="form.sensitiveHeadersList" class="w300" v-bind:disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input type="text" v-model="form.createTime" class="w300" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="updateTime">
          <el-input type="text" v-model="form.updateTime" class="w300" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-if="dialogStatus=='update'" type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { saveRoute, updateRoute, getById, delteById, fetchPage, refreshRoute } from '@/api/route.js'
import { mapGetters } from 'vuex'
import { parseTime } from '@/filters/index.js'
export default {
  data() {
    return {
      table: {
        query: {
          serviceId: '',
          current: 1,
          size: 10
        },
        data: [],
        total: 0,
        loading: false
      },
      form: {

      },
      sys_client_select: false,
      sys_client_view: false,
      sys_client_update: false,
      sys_client_delete: false,
      sys_client_add: false,
      rules: {
        serviceId: [
          {
            required: true,
            message: '请输入服务名称',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '请输入路由路径',
            trigger: 'blur'
          }]
      },
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      dialogStatus: 'create',
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    ...mapGetters(['client']),
    isView() {
      if (this.dialogStatus === 'view') {
        return true
      }
      return false
    }

  },
  filters: {
    formatSecret(value) {
      const arr = value.split('}')
      return arr.length > 1 ? arr[1] : value
    },
    statusFilter(status) {
      const statusMap = {
        0: '有效',
        1: '无效',
        9: '锁定'
      }
      return statusMap[status]
    }
  },
  mounted() {
    this.getData()
    this.sys_client_select = this.permissions['/admin/client:select']
    this.sys_client_add = this.permissions['/admin/client:add']
    this.sys_client_view = this.permissions['/admin/client:view']
    this.sys_client_update = this.permissions['/admin/client:update']
    this.sys_client_delete = this.permissions['/admin/client:delete']
  },
  methods: {

    /**
     * 获取分页数据
     */
    async getData() {
      const res = await fetchPage(this.table.query)
      this.table.loading = true
      if (res.code === 0) {
        this.table.data = res.data.records
        this.table.total = res.data.total
      } else {
        this.$message.error('查询错误！')
      }
      this.table.loading = false
    },
    /**
     * 刷新
     */
    refreshHandle() {
      this.table.query = {}
      this.table.query.current = 1
      this.table.query.size = 10
      this.getData()
    },

    /**
     * 打开添加框
     */
    addHandle(formName) {
      this.dialogStatus = 'create'
      this.form = {}
      this.dialogFormVisible = true
    },
    /**
    * 提交添加请求
    */
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.refresh()
          this.form.clientSecret = '{noop}' + this.form.clientSecret
          saveRoute(this.form).then(() => {
            this.dialogFormVisible = false
            this.getData()
            this.$message({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    /**
     * 根据id 获取详细数据并且显示
     * @method handleEditDict
     * @param id 数据id
     */
    async handleEditDict(id) {
      this.dialogStatus = 'update'
      const res = await getById(id)
      if (res.code === 0) {
        this.form = res.data
        this.form.createTime = parseTime(this.form.createTime, '{y}-{m}-{d} {h}:{i}')
        this.form.updateTime = parseTime(this.form.updateTime, '{y}-{m}-{d} {h}:{i}')

        this.dialogFormVisible = true
      }
    },
    /**
    * 提交修改请求
    */
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.createTime = null
          this.form.updateTime = null

          updateRoute(this.form).then(() => {
            this.dialogFormVisible = false
            this.refresh()
            this.getData()
            this.$message({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    /**
    * 根据id 获取详细数据并且显示
    * @method handleViewDict
    * @param id 数据id
    */
    async handleViewDict(id) {
      this.dialogStatus = 'view'
      const res = await getById(id)
      if (res.code === 0) {
        this.form = res.data
        this.form.createTime = parseTime(this.form.createTime, '{y}-{m}-{d} {h}:{i}')
        this.form.updateTime = parseTime(this.form.updateTime, '{y}-{m}-{d} {h}:{i}')
        this.dialogFormVisible = true
      }
    },
    /**
    * 取消显示修改框， 重置输入框
    */
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 删除
     */
    handleDelete(row) {
      this.$confirm(
        '此操作将永久删除该路由配置, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delteById(row)
          .then(() => {
            this.refresh()
            this.getData()
            this.$message({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
          .cache(() => {
            this.$message({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          })
      })
    },
    sizeChangeHandle(val) {
      this.table.query.size = val
      this.getData()
    },

    currentChangeHandle(val) {
      this.table.query.current = val
      this.getData()
    },
    async refresh() {
      await refreshRoute()
    }
  }
}
</script>
<style lang="scss" scoped>
.w300 {
  width: 400px;
}
</style>
