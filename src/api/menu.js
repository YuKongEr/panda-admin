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

export const updateReource = (resource) => {
  return request({
    url: '/admin/resource',
    method: 'put',
    data: resource
  })
}

export const getResourceById = (id) => {
  return request({
    url: 'admin/resource/id/' + id,
    method: 'get'
  })
}

export const deleteResourceById = (id) => {
  return request({
    url: 'admin/resource/id/' + id,
    method: 'delete'
  })
}
