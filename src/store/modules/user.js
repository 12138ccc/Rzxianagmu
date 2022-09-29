import { login } from '@/api/login'
import { getUserInfoAPI, getUserById } from '@/api/user'

export default {
  namespaced: true,
  state: {
    token: null,
    userinfo: {},
    hrsassTime: 0
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_INFO(state, userinfo) {
      state.userinfo = userinfo
    },
    STE_HRSASS_TIME(state, hrsassTime) {
      state.hrsassTime = hrsassTime // 属于时间1 属于获取到token的时间
    },
    REMOVE_TOKEN(state) {
      state.token = null
    },
    REMOVE_USERINFO(state) {
      state.userinfo = {}
    }

  },
  actions: {
    async loginAction({ commit }, loginData) {
      const data = await login(loginData)
      // console.log(data)
      commit('SET_TOKEN', data)
      commit('STE_HRSASS_TIME', new Date().getTime())
    },
    async getUserInfo({ commit }) {
      // 接口请求
      const res = await getUserInfoAPI()
      const res1 = await getUserById(res.userId)
      const result = { ...res, ...res1 } // 存在一块
      commit('SET_USER_INFO', result)
      return JSON.parse(JSON.stringify(result))
    },
    logout({ commit }) {
      commit('REMOVE_USERINFO')
      commit('REMOVE_TOKEN')
    }
  }

}
