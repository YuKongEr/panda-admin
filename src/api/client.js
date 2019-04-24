import request from '@/utils/request'

export const saveClient = (data) => {
  return request({
    url: '/admin/client',
    method: 'post',
    data: data
  })
}

export const updateClient = (data) => {
  return request({
    url: '/admin/client',
    method: 'put',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/admin/client/id/' + id,
    method: 'get'
  })
}

export const delteById = (id) => {
  return request({
    url: '/admin/client/id/' + id,
    method: 'delete'
  })
}

export const fetchPage = (query) => {
  return request({
    url: '/admin/client/page',
    method: 'get',
    params: query
  })
}
