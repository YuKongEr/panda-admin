/*
 * @Author: yukong 
 * @Date: 2019-01-24 09:37:52 
 * @Last Modified by: yukong
 * @Last Modified time: 2019-03-29 16:29:26
 */

<!--  -->
<template>
  <div class="container">
    <el-card>
      <el-row type="flex" justify="space-between">
        <el-col v-if="expand" :span="5">
          <el-row type="flex" justify="space-between">
            <el-col :span="14">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddDict">添加字典</el-button>
            </el-col>
            <el-col :span="10">
              <el-dropdown trigger="click" @command="handleCommand">
                <el-button size="small">
                  更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit">编辑字典</el-dropdown-item>
                  <el-dropdown-item command="delete">删除字典</el-dropdown-item>
                  <el-dropdown-item command="refresh">刷新</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
          <el-alert type="info" class="alert-tip" show-icon :closable="false" title=" 当前选择：">

            <span class="select-title">{{editTitle}}</span>
            <a class="select-clear" v-if="editTitle" @click="cancelEdit">取消选择</a>
          </el-alert>
          <el-input v-model="topDesc" placeholder="输入搜索字典" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getTopDict"></el-button>
          </el-input>
          <div class="tree-bar">
            <el-tree ref="tree" :highlight-current="highlight" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
        </el-col>
        <el-col :span="1" class="expand">
          <div @click="changeExpand">
            <i :class="expandIcon"></i>
          </div>
        </el-col>
        <el-col :span="span">
          <el-row>
            <el-form :model="searchForm" :inline="true">
              <el-form-item label="字典描述">
                <el-input v-model="searchForm.desc" placeholder="字典描述">
                </el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="searchForm.delFlag" placeholder="状态">
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="禁用" value="-1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getDictPage">查询</el-button>
                <el-button @click="reset">重置</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAddDictData">添加数据</el-button>
            <el-button icon="el-icon-delete" size="small">批量删除</el-button>

            <el-button icon="el-icon-refresh" size="small">刷新</el-button>
          </el-row>
          <el-alert type="info" class="alert-tip" show-icon :closable="false" title=" 当前选择：">

            <span class="select-title">{{selectKey.length}}</span>
            <a class="select-clear" v-if="editTitle" @click="cancelEdit">清空</a>
          </el-alert>
          <el-table :data="dictData" border style="width: 100%">
            <el-table-column type="selection" align="center" width="35">
            </el-table-column>
            <el-table-column prop="desc" align="center" label="字典描述(key)" width="200">
            </el-table-column>
            <el-table-column prop="value" align="center" label="字典值(value)" width="200">
            </el-table-column>
            <el-table-column prop="remark" align="center" label="备注" width="150">
            </el-table-column>
            <el-table-column prop="sortOrder" align="center" label="权重" width="120" sortable>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center" sortable>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.delFlag == 0">
                  正常
                </el-tag>
                <el-tag v-else type="danger">
                  禁用
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="200" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="handleEditDict(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog :title="dictDialogTitle" :visible.sync="dictDialogFormVisible" width="40%">
      <el-form :model="dictForm" ref="form" label-width="100px" :rules="dictDialogFormRules">
        <el-form-item label="字典名称" prop="desc">
          <el-input class="w347" v-model="dictForm.desc" placeholder="请输入字典名称"></el-input>
        </el-form-item>

        <el-form-item label="字典值" prop="value">
          <el-input class="w347" v-model="dictForm.value" placeholder="请输入字典值"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input class="w347" v-model="dictForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序权重" prop="sortOrder">
          <el-input-number controls-position="right" v-model="dictForm.sortOrder" placeholder="请输入排序权重"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelDict">取 消</el-button>
        <el-button type="primary" @click="handleSubmitDict">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dictDataDialogTitle" :visible.sync="dictDataDialogFormVisible" width="40%">
      <el-form :model="dictDataForm" :rules="dictDialogFormRules" ref="dictDataForm" label-width="100px">
        <el-form-item label="数据名称" prop="desc">
          <el-input class="w347" v-model="dictDataForm.desc" placeholder="请输入数据名称"></el-input>
        </el-form-item>

        <el-form-item label="数据值" prop="value">
          <el-input class="w347" v-model="dictDataForm.value" placeholder="请输入数据值"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input class="w347" v-model="dictDataForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="排序权重" prop="sortOrder">
          <el-input-number controls-position="right" v-model="dictDataForm.sortOrder" placeholder="请输入排序权重"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="delFlag">
          <el-switch v-model="dictDataForm.delFlag" active-color="#13ce66" inactive-color="#ff4949" active-text="正常" inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDictDataCancelDict">取 消</el-button>
        <el-button type="primary" @click="handleDictDataSubmitDict">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveDict, getTopDictListByDesc, getById, updateDict, deleteDictAndSubDict, fetchPage } from '@/api/dict.js'
export default {
  data() {
    return {
      highlight: true,
      currentNodeKey: -1,
      data: [{
        id: 1,
        label: '一级 1'
      }, {
        id: 2,
        label: '一级 2'
      }, {
        id: 3,
        label: '一级 3'
      }],
      defaultProps: {
        children: 'children',
        label: 'desc'
      },
      topDesc: '',
      selectKey: [],
      expand: true,
      span: 18,
      expandIcon: 'el-icon-arrow-left',
      editTitle: '',
      editId: null,
      searchKey: '',
      searchForm: {
        parentId: null,
        desc: '',
        delFlag: null,
        current: 1,
        size: 10
      },
      dictData: [],

      dictForm: {
        sortOrder: 1
      },
      dictDialogTitle: '',
      dictDialogType: null,
      dictDialogFormVisible: false,
      dictDialogFormRules: {
        desc: [{
          required: true,
          message: '字典名称不能为空',
          trigger: 'blur'
        }],
        value: [{
          required: true,
          message: '字典值不能为空',
          trigger: 'blur'
        }]
      },
      dictDataForm: {
        sortOrder: 1,
        delFlag: true
      },
      dictDataDialogTitle: '',
      dictDataDialogType: null,
      dictDataDialogFormVisible: false,
      dictDataDialogFormRules: {
        desc: [{
          required: true,
          message: '字典名称不能为空',
          trigger: 'blur'
        }],
        value: [{
          required: true,
          message: '字典值不能为空',
          trigger: 'blur'
        }]
      }

    }
  },

  components: {},

  computed: {},

  mounted() {
    this.getData()
  },

  methods: {
    handleCommand(command) {
      if (command === 'edit') {
        this.handleEditDict()
      }
      if (command === 'delete') {
        this.handleDeleteDict()
      }
      if (command === 'refresh') {
        this.getData()
      }
    },
    handleDeleteDict() {
      if (this.editId) {
        this.$confirm('此操作将永久删除该字典以及当前字典下的所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await deleteDictAndSubDict(this.editId)
          if (res.code === 0) {
            this.$message({
              message: '删除字典成功！',
              type: 'success'
            })
            this.getData()
          } else {
            this.$message.error('删除字典失败！')
          }
        }).catch(() => {

        })
      } else {
        this.$message({
          message: '请先选择要删除的字典',
          type: 'warning'
        })
      }
    },
    cancelEdit() {
      this.editTitle = ''
      this.highlight = false
      this.editId = null
      this.searchForm.parentId = null
      this.getDictPage()
    },
    handleNodeClick(data) {
      this.highlight = true
      this.editId = data.id
      this.searchForm.parentId = data.id
      this.editTitle = `${data.desc} (${data.value})`
      this.getDictPage()
    },
    changeExpand() {
      this.expand = !this.expand
      if (this.expand) {
        this.expandIcon = 'el-icon-arrow-left'
        this.span = 18
      } else {
        this.expandIcon = 'el-icon-arrow-right'
        this.span = 23
      }
    },
    reset() {
      this.searchForm.desc = ''
      this.searchForm.delFlag = null
    },
    handleAddDict() {
      this.dictDialogFormVisible = true
      this.dictDialogTitle = '添加字典'
      this.dictDialogType = 0
    },
    async handleEditDict(id) {
      if (id) {
        this.editId = id
      }
      if (this.editId) {
        const res = await getById(this.editId)
        this.dictForm = res.data
        this.dictDialogFormVisible = true
        this.dictDialogTitle = '编辑字典'
        this.dictDialogType = 1
      } else {
        this.$message({
          message: '请先选择要编辑的字典',
          type: 'warning'
        })
      }
    },
    handleCancelDict() {
      this.dictDialogFormVisible = false
      this.resetDictForm()
    },
    resetDictForm() {
      this.dictForm = {}
      this.dictForm.sortOrder = 1
      this.$refs['form'].resetFields()
    },
    resetDictDataForm() {
      this.dictDataForm = {}
      this.dictDataForm.sortOrder = 1
      this.dictDataForm.delFlag = true
      this.$refs['dictDataForm'].resetFields()
    },
    handleAddDictData() {
      if (this.editId) {
        this.dictDataDialogFormVisible = true
        this.dictDataDialogTitle = '添加字典' + this.editTitle + '数据'
        this.dictDataDialogType = 0
        this.dictDataDialogFormVisible = true
        this.dictDataForm.parentId = this.editId
      } else {
        this.$message({
          message: '请先选择要添加的字典类别',
          type: 'warning'
        })
      }
    },
    handleDictDataCancelDict() {
      this.dictDataDialogFormVisible = false
      this.resetDictDataForm()
    },
    async handleSubmitDict() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.dictDialogType === 0) {
            // 添加字典 顶层 parentId = -1
            this.dictForm.parentId = -1
            this.dictForm.delFlag = 0
            const res = await saveDict(this.dictForm)
            if (res.code === 0) {
              this.$message({
                message: '添加字典成功！',
                type: 'success'
              })
              this.getData()
              this.dictDialogFormVisible = false
              this.handleCancelDict()
            } else {
              this.$message.error('添加字典失败！')
            }
          }
          if (this.dictDialogType === 1) {
            const res = await updateDict(this.dictForm)
            if (res.code === 0) {
              this.$message({
                message: '修改字典成功！',
                type: 'success'
              })
              this.getData()
              this.dictDialogFormVisible = false
              this.handleCancelDict()
            } else {
              this.$message.error('修改字典失败！')
            }
          }
        }
      })
    },
    async handleDictDataSubmitDict() {
      this.$refs['dictDataForm'].validate(async valid => {
        if (valid) {
          this.dictDataForm.delFlag = this.dictDataForm.delFlag ? 0 : 1
          if (this.dictDataDialogType === 0) {
            const res = await saveDict(this.dictDataForm)
            if (res.code === 0) {
              this.$message({
                message: '添加数据成功！',
                type: 'success'
              })
              this.getData()
              this.dictDataDialogFormVisible = false
              this.handleDictDataCancelDict()
            } else {
              this.$message.error('添加数据失败！')
            }
          }
          if (this.dictDataDialogType === 1) {
            const res = await updateDict(this.dictDataForm)
            if (res.code === 0) {
              this.$message({
                message: '修改数据成功！',
                type: 'success'
              })
              this.getData()
              this.dictDataDialogFormVisible = false
              this.handleDictDataCancelDict()
            } else {
              this.$message.error('修改数据失败！')
            }
          }
        }
      })
    },
    async getTopDict() {
      const res = await getTopDictListByDesc(this.topDesc)
      this.data = res.data
    },
    async getDictPage() {
      const res = await fetchPage(this.searchForm)
      if (res.code === 0) {
        this.dictData = res.data.records
      }
    },
    async getData() {
      this.getTopDict()
      this.getDictPage()
    }
  }
}

</script>
<style lang='scss' scoped>
.container {
  .alert-tip {
    background-color: #f0faff;
    border: 1px solid #abdcff;
    margin-top: 10px;
    font-size: 10px;
    margin-bottom: 20px;
  }
  .select-title {
    font-size: 14px;
    font-weight: 600;
    color: #40a9ff;
  }
  .select-clear {
    margin-left: 10px;
    color: #4043ff;
  }
  .tree-bar {
    margin-top: 20px;
  }
  .expand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      cursor: pointer;
    }
    :hover {
      color: #1890ff !important;
    }
  }
}
.is-big {
  font-size: 14px !important;
  width: 28px;
}
label {
  font-weight: 400 !important;
}
</style>