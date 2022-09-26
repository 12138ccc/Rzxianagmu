import router from '@/router'
import store from '@/store'

const WhileList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  if (store.getters.token) { // 处于登录状态
    if (!store.state.user.userinfo.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else { // 没有登录
    if (WhileList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
