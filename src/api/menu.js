import request from '@/utils/request'
export function GetMenu() {
  return request({
    url: '/admin/resource/menu/tree',
    method: 'get'
  })
}

export function getAllReource() {
  return request({
    url: '/admin/resource/tree',
    method: 'get'
  })
}

export function saveReource(resource) {
  return request({
    url: '/admin/resource',
    method: 'post',
    data: resource
  })
}

export const getResourceById = (id) => {
  return request({
    url: 'admin/resource/id/' + id,
    method: 'get'
  })
}
