import {
  constantRouterMap
} from '@/router'
import {
  validatenull
} from '@/utils/validate'

import {
  GetMenu
} from '@/api/menu'
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

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
                if (!validatenull(child.component)) child.path = `${ele.path}/${child.path}`
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
