import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'
import echarts from 'echarts'
import axios from 'axios';
import store from './store'
Vue.prototype.$http=axios
Vue.prototype.$echarts = echarts
Vue.use(VueCookies)
Vue.use(Element)
Vue.config.productionTip = false
import components from './plugins/Component'//加载公共组件
Object.keys(components).forEach((key) => {
  var name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component('v'+name, components[key])
})

router.beforeEach((to, from, next) => {
  console.log(to.meta.requireAuth)
  // store.state.user.username = 'admin'
  console.log(store.state.user.username)
      if (to.meta.requireAuth) {
        if (store.state.user.username) {
          next()
        } else {
          next({
            name:'login'
          });
          alert("未登录！")
        }
      } else {
        next()
      }
    }
)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
