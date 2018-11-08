import request from '@/utils/request'

export const fetchTableList = (param) => {
  return request({
    url: '/gen/table/page',
    method: 'get',
    params: param
  })
}

export const exportCodeZip = (param) => {
  console.log(1)
  return request({
    url: '/gen/code',
    method: 'post',
    data: param,
    responseType: 'blob'
  })
}
