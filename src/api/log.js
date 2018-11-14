import request from '@/utils/request'

export const fetchLogPage = (param) => {
  return request({
    url: '/admin/log/page',
    method: 'get',
    params: param
  })
}

