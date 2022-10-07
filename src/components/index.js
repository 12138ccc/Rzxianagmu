// import PageTools from './PageTools/index.vue'
// const components = [PageTools]

// export default {
//   install: function(Vue) {
//     components.forEach(ele => {
//       console.log(ele)
//       Vue.component(ele.name, ele)
//     })
//   }
// }

const fn = require.context('./', true, /\.vue$/)

console.log(fn.keys()) // 路径
console.log(fn('./PageTools/index.vue')) // 根据路径查找模块
// 一次性导入所有的模块
const components = fn.keys().map(ele => {
  return fn(ele)
})
export default (Vue) => {
  components.forEach(ele => {
    // console.log(ele)
    Vue.component(ele.default.name, ele.default)
  })
}
