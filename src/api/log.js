import request from '@/utils/request'

export const fetchLogPage = (param) => {
  return request({
    url: '/admin/log/page',
    method: 'get',
    params: param
  })
}

const hasClass = (id, someClass) => {
  const obj = document.getElementById(id)
  if (!obj) {
    return false
  }
  if (obj.classList.contains(someClass) === true) {
    return true
  }
  return false
}
