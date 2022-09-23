import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
// 返回的方法具有一个 keys 属性
// keys 函数 返回一个数组
console.log(req)
console.log(req.keys())
// console.log(req('./dashboard.svg'))
// const requireAll = requireContext => requireContext.keys().map(requireContext)
const requireAll = requireContext => requireContext.keys().map((val) => {
  return requireContext(val)
})
// map 返回一个新数组
// 长和原来的一样
// 映射
// ['./dashboard.svg'].map(requireContext)
requireAll(req)
console.log(requireAll(req))
