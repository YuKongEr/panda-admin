<template>

  <!--背景图-->
  <div
    class="note"
    :style="note"
  >
    <!--login框，表单+tab标签页的组合-->
    <div
      class="loginFrame emo-ruleForm login-container"
      style="background: #f0f0f0;"
    >
      <!--表单组件放在外面，标签栏在里面-->

      <el-tabs v-model="activeName">
        <el-tab-pane
          label="用户名密码登录"
          name="user"
        >
          <user></user>
        </el-tab-pane>
        <el-tab-pane
          label="手机验证码登录"
          name="second"
        >
          <mobile-code></mobile-code>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  isvalidUsername
} from '@/utils/validate'
import user from './user'
import mobileCode from './code'

export default {
  name: 'login',
  components: {
    user,
    mobileCode
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的用户名'))
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'user',
      loginForm: {
        username: 'yukong',
        password: 'abc123'
      },
      loginRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }]
      },
      loading: false,
      pwdType: 'password',
      note: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '100%',
        height: '100%',
        backgroundImage: 'url(' + require('../../assets/bg.png') + ')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'

      }
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({
              path: '/'
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>

<style>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 15px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  position: absolute;
  right: 50px;
}
label {
  width: 70px;
  text-align: left;
}

.form-control {
  width: 270px;
  flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
}
.remember {
  width: 250px;
  text-align: left;
}
.forget {
  width: 500px;
  text-align: right;
  font-size: 14px;
  font-family: PingFang SC;
}
.remFor {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.tabsUser {
  display: inline-block;
  margin-left: 0px;
  margin-right: 0px;
  text-align: center;
  font-size: 25px;
}
</style>