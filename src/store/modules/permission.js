import {
  constantRouterMap
} from '@/router'
import {
  validatenull,
  validateURL
} from '@/utils/validate'

import {
  GetMenu
} from '@/api/menu'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap
    },
    ADD_ROUTERS: (state, addRouters) => {
      state.routers = constantRouterMap.concat(addRouters)
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        resolve()
      })
    },
    // 获取系统菜单
    GetMenu({
      commit
    }) {
      return new Promise(resolve => {
        GetMenu().then((res) => {
          const data = res.data
          data.forEach(ele => {
            if (ele.children) {
              ele.children.forEach(child => {
                if (!validatenull(child.component)) {
                  if (validateURL(child.path)) {
                    child.path = `${child.path}`
                  } else {
                    child.path = `${ele.path}/${child.path}`
                  }
                }
              })
            }
          })
          commit('SET_ROUTERS', data)
          resolve(data)
        })
      })
    }
  }
}

export default permission
