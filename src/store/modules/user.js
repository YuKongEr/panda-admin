import {
  login,
  logout,
  getInfo,
  mobileLogin
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  setStore,
  getStore
} from '@/utils/store'

const user = {
  state: {
    token: getToken(),
    name: getStore({
      name: 'name'
    }) || '',
    avatar: getStore({
      name: 'avatar'
    }) || '',
    roles: [],
    permissions: getStore({
      name: 'permissions'
    }) || {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setStore({
        name: 'token',
        content: state.token,
        type: 'session'
      })
    },
    SET_NAME: (state, name) => {
      state.name = name
      setStore({
        name: 'name',
        content: state.name,
        type: 'session'
      })
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      setStore({
        name: 'avatar',
        content: state.avatar,
        type: 'session'
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }
      state.permissions = list
      setStore({
        name: 'permissions',
        content: state.permissions,
        type: 'session'
      })
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 验证码登录
    LoginByPhone({
      commit
    }, userInfo) {
      const mobile = userInfo.mobile.trim()
      const code = userInfo.code.trim()
      return new Promise((resolve, reject) => {
        mobileLogin(mobile, code).then(response => {
          if (response.access_token) {
            const data = response
            setToken(data.access_token)
            commit('SET_TOKEN', data.access_token)
            resolve(response)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.sysUser.username)
          commit('SET_AVATAR', data.sysUser.avatar)
          commit('SET_PERMISSIONS', data.permissions)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout({ access_token: state.token }).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])

          commit('SET_NAME', [])

          commit('SET_AVATAR', [])

          commit('SET_PERMISSIONS', {})

          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_PERMISSIONS', {})
        removeToken()
        resolve()
      })
    }
  }
}

export default user
