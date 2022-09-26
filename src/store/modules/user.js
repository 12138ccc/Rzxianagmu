import { login } from '@/api/login'
import { getUserInfoAPI, getUserById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userinfo: {}
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_INFO(state, userinfo) {
      state.userinfo = userinfo
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      const data = await login(loginData)
      console.log(data)
      commit('SET_TOKEN', data)
    },
    async getUserInfo({ commit }) {
      // 接口请求
      const res = await getUserInfoAPI()
      const res1 = await getUserById(res.userId)
      const result = { ...res, ...res1 } // 存在一块
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result))
    }
  }
}
