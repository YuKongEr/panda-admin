import request from '@/utils/request'

export function fetchDeptTree () {
    return request({
        url: '/admin/dept/tree',
        method: 'get'
    })
}
