import  request  from "@/utils/request";

export function getDeptRoleList(deptId) {
    return request({
        url: '/admin/role/dept/' + deptId,
        method: 'get'
    })
}