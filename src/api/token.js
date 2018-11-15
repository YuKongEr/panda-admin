import request from '@/utils/request'

export const fetchTokenPage = (param) => {
  return request({
    url: '/auth/token/page',
    method: 'get',
    params: param
  })
}

export const deleteToken = (param) => {
  return request({
    url: '/auth/token/' + param,
    method: 'delete'
  })
}

