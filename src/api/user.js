import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/id/' + id,
    method: 'delete'
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/id/' + id,
    method: 'get'
  })
}
export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}
export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}
