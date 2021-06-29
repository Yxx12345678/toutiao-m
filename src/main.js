import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入vant核心组件库

import Vant from 'vant'

// 加载vant全局样式
import 'vant/lib/index.css'

// 引入全局样式
import './styles/index.less'

// 加载动态设置REM基准值
import 'amfe-flexible'

// 加载初始化时间格式化
import './utils/dayjs'

// 注册使用vant组建库
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
