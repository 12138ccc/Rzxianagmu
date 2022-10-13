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

/**
 * 保存用户信息
 * @param {Object} data
 * @returns promise
 */
export const saveUserById = (data) => request({
  url: `/sys/user/${data.id}`,
  method: 'put',
  data
})
export function logout() {

}
