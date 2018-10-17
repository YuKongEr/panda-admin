import request from '@/utils/request'
import qs from 'qs';

export function login(username, password) {
  var grantType = 'password'
  var clientId = 'cloud'
  var clientSecret = 'cloud'
  var param = qs.stringify({
    username: username,
    password: password,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType
  })
  console.log(param)
  return request({

    url: '/auth/oauth/token',
    method: 'post',
    data: param
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/user/info',
    method: 'get',
    params: {
      'access_token': token
    }
  })
}

export function logout() {
  return request({
    url: '/admin/user/logout',
    method: 'post'
  })
}
