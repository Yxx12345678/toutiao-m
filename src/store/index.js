import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
Vue.use(Vuex)
const TOUTIAO_KEY = 'TOUTIAO_USER' // 定义一个常量
export default new Vuex.Store({
  state: {
    user: getItem(TOUTIAO_KEY), // 一个对象，用来存储用户登录信息
    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUser (state, data) {
      state.user = data // 传入的token和refesh-token给user
      // 为了防止数据丢失，我们把token存入本地存储中，更持久化
      setItem(TOUTIAO_KEY, state.user)
    },
    // 添加缓存页,如果页面不包含这个页面，我就把这个页面添加进缓存页面
    addCachePages (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },

    // 移除缓存页,如果页面有这个缓存我就把这个缓存删掉
    removeCachePages (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }

  },
  actions: {
  },
  modules: {
  }
})
