import request from '@/utils/request'

export const saveRoute = (data) => {
  return request({
    url: '/admin/route',
    method: 'post',
    data: data
  })
}

export const updateRoute = (data) => {
  return request({
    url: '/admin/route',
    method: 'put',
    data: data
  })
}

export const getById = (id) => {
  return request({
    url: '/admin/route/id/' + id,
    method: 'get'
  })
}

export const delteById = (id) => {
  return request({
    url: '/admin/route/id/' + id,
    method: 'delete'
  })
}

export const fetchPage = (query) => {
  return request({
    url: '/admin/route/page',
    method: 'get',
    params: query
  })
}

export const refreshRoute = () => {
  return request({
    url: '/refresh',
    method: 'get'
  })
}
