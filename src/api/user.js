import request from '@/utils/request'

export function login(data) {

}

export function getUserInfoAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST'

  })
}

export const getUserById = (id) => request({
  url: `/sys/user/${id}`
})
export function logout() {

}
