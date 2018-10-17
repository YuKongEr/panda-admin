<template>
  <div>
    <div  class="search-container">
      <div  class="search-inp-container">
        <el-input
           @keyup.enter.native="handleSearch"
          placeholder=""
          v-model="listQuery.username"
          clearable>
        </el-input>
      </div>
      <el-button  class="search-btn" type="success"  @click="handleSearch">查询</el-button>
      <el-button class="search-btn" type="warning" v-if="sys_user_add" @click="handleAdd">添加</el-button>
     
    </div>  
    <el-table :key='tableKey' :data="list" v-loading="listLoading"  border fit highlight-current-row>
      <el-table-column
        prop="userId"
        label="id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column align="center" label="所属部门" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.deptName}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="角色">
        <template slot-scope="scope">
          <span v-for="role in scope.row.roleList">{{role.roleDesc}} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.delFlag == 0">
            {{scope.row.delFlag | statusFilter}}
          </el-tag>
          <el-tag v-else type="danger">
            {{scope.row.delFlag | statusFilter}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180"  v-if="sys_user_upd == false && sys_user_del == false">
        <template slot-scope="scope">
        <el-button
          v-if="sys_user_upd"
          size="mini"
          type="primary"
          @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          v-if="sys_user_del"
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" :props="defaultProps" @node-click="getNodeData" default-expand-all>
      </el-tree>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input class="w347" v-model="form.username" placeholder="请输用户名"></el-input>
        </el-form-item>

        <el-form-item class="w347" v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="newPassword">
          <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>

        <el-form-item label="所属部门" prop="deptName">
          <el-input class="w347" v-model="form.deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input>
          <input type="hidden" v-model="form.deptId" />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select  class="filter-item w347" v-model="role" placeholder="请选择" multiple>
            <el-option v-for="item in rolesOptions" :key="item.roleId" :label="item.roleDesc" :value="item.roleId" :disabled="isDisabled[item.delFlag]">
              <span style="float: left">{{ item.roleDesc }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input class="w347" v-model="form.phone" placeholder="验证码登录使用"></el-input>
        </el-form-item>

        <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="delFlag">
          <el-select class="filter-item w347" v-model="form.delFlag" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, delObj, getObj, addObj, putObj } from "@/api/user"
import { getDeptRoleList } from "@/api/role";
import { fetchDeptTree } from '@/api/dept';
import { mapGetters } from "vuex";
import { parseTime } from "@/utils/index";
export default {
  data () {
    return {
      tableKey: 0,
      listLoading: false,
      list: [],  
      listQuery: {
        page: 1,
        limit: 20,
        username:""
      },
      total: 0,
      sys_user_add: false,
      sys_user_upd: false,
      sys_user_del: false,
      dialogFormVisible: false,
      form: {
        username: undefined,
        newPassword: undefined,
        delFlag: undefined,
        deptId: undefined,
        phone: undefined,
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入账户",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ],
        deptId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur"
          }
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "手机号",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "长度在11 个字符",
            trigger: "blur"
          }
        ]
      },
      textMap: {
        update: "编辑",
        create: "创建"
      },
      dialogStatus: "",
      role:[],
      rolesOptions: [],
      isDisabled: {
        0: false,
        1: true
      },
      statusOptions: ["0", "1"],
      dialogDeptVisible: false,
      treeDeptData:[],
      checkedKeys: [],
      defaultProps: {
        children: "childrens",
        label: "name"
      },
    }
  },

  components: {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "有效",
        1: "无效",
        9: "锁定"
      };
      return statusMap[status];
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },

  mounted() {
      this.getList();
      this.sys_user_add = this.permissions["sys_user_add"];
      this.sys_user_upd = this.permissions["sys_user_upd"];
      this.sys_user_del = this.permissions["sys_user_del"];
  },

  methods: {
      getList() {
      this.listLoading = true;
      this.listQuery.isAsc = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.records;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    handleAdd() {
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      this.$confirm(
        "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        delObj(row.userId)
          .then(() => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
          })
          .cache(() => {
            this.$notify({
              title: "失败",
              message: "删除失败",
              type: "error",
              duration: 2000
            });
          });
      });
    },
    handleEdit(row){
      this.dialogStatus = 'update'
      getObj(row.userId).then(response=>{
        this.form = response;
        console.log(this.form)
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
        this.role = [];
        for (var i = 0; i < row.roleList.length; i++) {
          this.role[i] = row.roleList[i].roleId;
        }
         getDeptRoleList(response.deptId).then(response => {
          this.rolesOptions = response.data;
        });
      })
      this.dialogFormVisible = true;
    },
    handleDept(){
       fetchDeptTree().then(response => {
        this.treeDeptData = response.data;
        this.dialogDeptVisible = true;
      });
    },
    handleSearch() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    getNodeData(data) {
      this.dialogDeptVisible = false;
      this.form.deptId = data.id;
      this.form.deptName = data.name;
      getDeptRoleList(data.id).then(response => {
        this.rolesOptions = response.data;
      });
    },
   create(formName) {
      const set = this.$refs;
      this.form.role = this.role;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      this.form.role = this.role;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          putObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
  }
}

</script>
<style lang='scss' scoped>
.w347{
      width: 100%;
}

</style>