<template>
  <div>
    <div class="search-container">
      <el-input v-if="sys_client_select" placeholder="请输入client id" v-model="table.query.clientId" style="width:200px" @keyup.enter.native="getData" clearable />
      <el-select v-if="sys_client_select" v-model="table.query.authorizedGrantTypes" placeholder="请选择认证授权类型">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button v-if="sys_client_select" class="search-btn" type="primary" icon="el-icon-search" @click="getData">查询</el-button>
      <el-button v-if="sys_client_add" class="search-btn" type="primary" icon="el-icon-plus" @click="addHandle('form')">添加</el-button>

      <el-button v-if="sys_client_select" class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" :default-sort="{prop : 'roleName', prop: 'roleCode'}" border highlight-current-row fit>
      <el-table-column fixed align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="clientId" prop="clientId"></el-table-column>
      <el-table-column align="center" label="client密码">

        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.clientSecret | formatSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="范围" prop="scope"></el-table-column>
      <el-table-column align="center" label="授权认证类型" prop="authorizedGrantTypes"></el-table-column>
      <el-table-column align="center" label="回调地址" prop="webServerRedirectUri"></el-table-column>
      <el-table-column align="center" label="是否自动放行">

        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.autoapprove === 'true' ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button v-if="sys_client_view" size="mini" type="primary" @click="handleViewDict(scope.row.clientId)">查看</el-button>

          <el-button v-if="sys_client_update" size="mini" type="primary" @click="handleEditDict(scope.row.clientId)">编辑</el-button>
          <el-button v-if="sys_client_delete" size="mini" type="danger" @click="handleDelete(scope.row.clientId)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="table.query.current" :page-size="table.query.size" :total="table.total" :page-sizes="[10, 40, 80, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="55%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="client id" prop="clientId">
              <el-input v-model="form.clientId" placeholder="请输入clientId" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="secret" placeholder="请输入client secret" prop="clientSecret">
              <el-input type="text" v-model="secret" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="范围" prop="scope">
              <el-input v-model="form.scope" placeholder="请输入范围" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="认证模式" prop="authorizedGrantTypes">
              <el-input v-model="form.authorizedGrantTypes" placeholder="请输入认证模式" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="回调地址" prop="webServerRedirectUri">
              <el-input v-model="form.webServerRedirectUri" placeholder="请输入回调地址" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限" prop="authorities">
              <el-input v-model="form.authorities" placeholder="请输入权限" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="令牌时效" prop="accessTokenValidity">
              <el-input v-model="form.accessTokenValidity" placeholder="请输入令牌时效" class="w300" type="number" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="刷新时效" prop="refreshTokenValidity">
              <el-input v-model="form.refreshTokenValidity" placeholder="请输入刷新时效" class="w300" type="number" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="扩展信息" prop="additionInformation">
              <el-input v-model="form.additionInformation" placeholder="请输入扩展信息" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源id" prop="resourcesIds">
              <el-input v-model="form.resourcesIds" placeholder="请输入资源id" class="w300" v-bind:disabled="isView"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="自动放行" prop="autoapprove">
            <el-radio v-model="form.autoapprove" label="true" v-bind:disabled="isView">是</el-radio>
            <el-radio v-model="form.autoapprove" label="false" v-bind:disabled="isView">否</el-radio>
          </el-form-item>
        </el-row>
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
import { saveClient, updateClient, getById, delteById, fetchPage } from '@/api/client.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      options: [
        {
          label: '授权码模式',
          value: 'authorization_code'
        },
        {
          label: '密码模式',
          value: 'password'
        }, {
          label: '客户端模式',
          value: 'client_credentials'
        }, {
          label: '简化模式',
          value: 'implicit'
        }
      ],
      table: {
        query: {
          clientId: '',
          authorizedGrantTypes: '',
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
        clientId: [
          {
            required: true,
            message: '请输入clientId',
            trigger: 'blur'
          }
        ],
        secret: [
          {
            required: true,
            message: '请输入client密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '密码长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        scope: [
          {
            required: true,
            message: '请输入授权范围',
            trigger: 'blur'
          }
        ],
        authorizedGrantTypes: [
          {
            required: true,
            message: '请输入认证类型',
            trigger: 'blur'
          }
        ],
        autoapprove: [
          {
            required: true,
            message: '请选择是否自动放行',
            trigger: 'blur'
          }
        ]
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
    secret: {

      get() {
        if (this.form.clientSecret) {
          return this.form.clientSecret.split('}')[1]
        }
        return this.form.clientSecret
      },
      set(newValue) {
        this.form.clientSecret = newValue
        return newValue
      }
    },
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
      this.$refs[formName].resetFields()

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
          this.form.clientSecret = '{noop}' + this.form.clientSecret
          saveClient(this.form).then(() => {
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
          this.form.clientSecret = '{noop}' + this.form.clientSecret
          updateClient(this.form).then(() => {
            this.dialogFormVisible = false
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
        '此操作将永久删除该终端(clientId:' + row + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delteById(row)
          .then(() => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.w300 {
  width: 300px;
}
</style>
