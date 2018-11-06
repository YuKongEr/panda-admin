import request from '@/utils/request'

export const fetchRolePage = (param) => {
  return request({
    url: '/admin/role/page',
    method: 'get',
    params: param
  })
}

export const getRoleInfoById = (id) => {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export const saveRole = (role) => {
  return request({
    url: '/admin/role',
    method: 'post',
    data: role
  })
}

export const updateRole = (role) => {
  return request({
    url: '/admin/role',
    method: 'put',
    data: role
  })
}
export const deleteRoleInfoById = (id) => {
  return request({
    url: '/admin/role/' + id,
    method: 'delete'
  })
}

export const listRoleInfo = () => {
  return request({
    url: '/admin/role',
    method: 'get'
  })
}

