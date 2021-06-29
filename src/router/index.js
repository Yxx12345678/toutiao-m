import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由规则数组，路由规则数组里必须有path和cpmponent属性
const routes = [
  {
    path: '/login', // 当前路由规则匹配的hash地址
    name: 'login',
    component: () => import('@/views/login') // 表示要展示的登录页面的组件
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout'),
    children: [{
      path: '', // 默认子路由
      name: 'home',
      component: () => import('@/views/home')
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('@/views/qa')
    },
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/video')
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('@/views/my')
    }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true
  }
  // 将动态路由映射到组件的props中，无论是访问还是维护够很方便
]

// 创建路由实例对象
const router = new VueRouter({
  routes
})
export default router
