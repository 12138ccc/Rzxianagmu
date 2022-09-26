import router from '@/router'
import store from '@/store'

const WhileList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  if (store.getters.token) { // 处于登录状态
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
