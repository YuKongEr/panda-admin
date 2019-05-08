import request from '@/utils/request'

export const getJobById = (id) => {
  return request({
    url: '/admin/quartz/job/id/' + id,
    method: 'get'
  })
}

export const saveJob = (data) => {
  return request({
    url: '/admin/quartz/job/add',
    method: 'post',
    data: data
  })
}

export const updateJob = (data) => {
  return request({
    url: '/admin/quartz/job/edit',
    method: 'put',
    data: data
  })
}

export const deleteJob = (id) => {
  return request({
    url: '/admin/quartz/job/delByIds/' + id,
    method: 'delete'
  })
}

export const pauseJob = (data) => {
  return request({
    url: '/admin/quartz/job/pause',
    method: 'post',
    data: data
  })
}

export const resumeJob = (data) => {
  return request({
    url: '/admin/quartz/job/resume',
    method: 'post',
    data: data
  })
}

export const fetchPage = (query) => {
  return request({
    url: '/admin/quartz/job/page',
    method: 'get',
    params: query
  })
}
