import request from '@/utils/request'

export const saveDict = (data) => {
  return request({
    url: '/admin/dict',
    method: 'post',
    data: data
  })
}

export const updateDict = (data) => {
  return request({
    url: '/admin/dict',
    method: 'put',
    data: data
  })
}

export const getTopDictList = () => {
  return request({
    url: '/admin/dict/top',
    method: 'get'
  })
}
export const getByParentId = (parentId) => {
  return request({
    url: '/admin/dict/parent/' + parentId,
    method: 'get'
  })
}

export const getById = (id) => {
  return request({
    url: '/admin/dict/id/' + id,
    method: 'get'
  })
}

export const deleteDictAndSubDict = (id) => {
  return request({
    url: '/admin/dict/id/parent/' + id,
    method: 'delete'
  })
}

export const delteById = (id) => {
  return request({
    url: '/admin/dict/id/' + id,
    method: 'delete'
  })
}

export const fetchPage = (query) => {
  return request({
    url: '/admin/dict/page',
    method: 'get',
    params: query
  })
}
