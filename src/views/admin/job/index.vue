/*
 * @Author: yukong 
 * @Date: 2019-05-04 14:29:10 
 * @Last Modified by: yukong
 * @Last Modified time: 2019-05-08 16:41:06
 */

<template>
  <div>
    <div class="search-container">
      <el-button type="primary" icon="el-icon-plus" @click="handleAddJob">安排新任务</el-button>
      <el-button icon="el-icon-delete" @click="handleDeleteAll">批量删除</el-button>
      <el-button class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>
    <el-table v-loading="table.loading" :data="table.data" :default-sort="{prop : 'roleName', prop: 'roleCode'}" border highlight-current-row fit @selection-change="changeCheckId">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column fixed align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" label="任务类" prop="jobClassName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="cron表达式" prop="cronExpression"></el-table-column>
      <el-table-column align="center" label="参数" prop="parameter" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="任务描述" prop="description" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0">
            运行中
          </el-tag>
          <el-tag v-else type="danger">
            已停止
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="sys_token_index_delete" width="300">
        <el-badge is-dot class="item">数据查询</el-badge>
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.status == 0" @click="handlePauseJob(scope.row)">
            <svg-icon icon-class="pause" />暂停任务</el-button>
          <el-button type="success" size="mini" v-else @click="handleresumeJob(scope.row)">
            <svg-icon icon-class="goon" />恢复执行

          </el-button>
          <el-button size="mini" type="primary" @click="handleEditJob(scope.row.id)">编辑</el-button>

          <el-button size="mini" type="danger" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!table.loading" class="footer">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="table.query.current" :page-size="table.query.size" :total="table.total" :page-sizes="[10, 40, 80, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" @close="cancel('form')">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="任务类" prop="jobClassName">
          <el-input class="w347" v-model="form.jobClassName" placeholder="例如com.yukong.panda.user.job.SampleJob"></el-input>
        </el-form-item>

        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input class="w347" v-model="form.cronExpression" placeholder=""></el-input>
          <a target="_blank" href="http://cron.qqe2.com/">
            <svg-icon icon-class="go" />在线cron表达式生成
          </a>
        </el-form-item>

        <el-form-item label="参数" prop="parameter">
          <el-input class="w347" v-model="form.parameter" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input class="w347" v-model="form.description" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">保存并安排</el-button>
        <el-button v-else type="primary" @click="update('form')">保存并安排</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getJobById, saveJob, updateJob, deleteJob, pauseJob, resumeJob, fetchPage } from '@/api/job'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      exceptionMsg: '',
      table: {
        data: [],
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
      sys_token_index_delete: false,
      form: {
        jobClassName: '',
        cronExpression: '',
        description: '',
        parameter: ''
      },
      textMap: {
        'update': '编辑任务',
        'create': '添加任务'
      },
      dialogFormVisible: false,

      dialogStatus: 'create',
      rules: {
        jobClassName: [
          {
            required: true,
            message: '请输入任务类',
            trigger: 'blur'
          }
        ],
        cronExpression: [
          {
            required: true,
            message: '请输入cron表达式',
            trigger: 'blur'
          }
        ]
      },
      multipleSelection: []
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
      const res = await fetchPage(this.table.query)
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
    changeCheckId(val) {
      this.multipleSelection = val.map(ele => ele.id)
    },
    handleDeleteAll() {
      this.deleteHandle(this.multipleSelection.join(','))
    },
    handleAddJob() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    async handleEditJob(id) {
      this.dialogStatus = 'update'
      const res = await getJobById(id)
      console.log(res)
      if (res.code === 0) {
        this.form = res.data
        this.dialogFormVisible = true
      }
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
    handlePauseJob(job) {
      const h = this.$createElement
      this.$confirm('提示', {
        message: h('span', {
          class: 'message-span'
        }, '是否暂停任务' + job.jobClassName + '？'),
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const res = await pauseJob(job)
        if (res.code === 0) {
          this.$notify({
            title: '成功',
            message: '暂停任务成功',
            type: 'success'
          })
          this.getData()
        } else {
          this.$notify.error({
            title: '失败',
            message: '暂停任务失败'
          })
        }
      })
    },
    handleresumeJob(job) {
      const h = this.$createElement
      this.$confirm('提示', {
        message: h('span', {
          class: 'message-span'
        }, '是否恢复执行任务' + job.jobClassName + '？'),
        title: '提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(async() => {
        const res = await resumeJob(job)
        if (res.code === 0) {
          this.$notify({
            title: '成功',
            message: '恢复执行任务成功',
            type: 'success'
          })
          this.getData()
        } else {
          this.$notify.error({
            title: '失败',
            message: '恢复执行任务失败'
          })
        }
      })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          saveJob(this.form).then((res) => {
            if (res.code === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '添加任务成功',
                type: 'success',
                duration: 2000
              })
              this.getData()
            } else {
              this.$notify.error({
                title: '失败',
                message: '添加任务失败'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      const form = this.$refs[formName]
      form.resetFields()

      this.form = {
        jobClassName: '',
        cronExpression: '',
        description: '',
        parameter: ''
      }
      this.dialogFormVisible = false
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          updateJob(this.form).then((res) => {
            if (res.code === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getData()
            } else {
              this.$notify.error({
                title: '失败',
                message: '修改任务失败'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    deleteHandle(id) {
      this.$confirm('是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteJob(id)
        if (res.code === 0) {
          this.$notify({
            title: '成功',
            message: '删除任务成功',
            type: 'success',
            duration: 2000
          })
          this.getData()
        } else {
          this.$notify.error({
            title: '失败',
            message: '删除任务失败'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  padding-top: 20px;
}

.message-span {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
</style>
