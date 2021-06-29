/**
 * 封装 axios 请求模块函数
 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
import router from '@/router'
import { Toast } from 'vant'

const refreshTokenRequest = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONBig.parse(data)
      // axios 默认返回JOSN.parse(data)数据
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config // 配置信息必须从这里出去，否则没有出口
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.request.use(
  function (response) {
    return response
  },
  function (error) {
    const { status } = error.response
    if (status === 400) {
      // 客户端请求参数错误
      Toast.fail('客户端请求参数错误')
    } else if (status === 401) {
      // token过期问题
      // 如果没有user 或者user.token，直接让用户去登录
      // 如果有refresh_token,则请求获取新的token,之后把它更新到容器里
      // 把失败的请求重新发出去
      const { user } = store.state
      if (!user || !user.token) {
        // 直接跳转登录页
        return redirectLogin()
      }
      // 使用refresh_token 去更新token,这里要单独创建一个请求对象，它失败是不会进入token的
      try {
        const { data } = refreshTokenRequest({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 拿到新的token以后把它更新到容器中去，
        user.token = data.data.token
        store.commit('setuser', user)
        // 把错误的请求重新发出去,这里使用自己的拦截器,一定要用自己的request
        return request(error.config)
      } catch (err) {
        // 刷新token失败，直接跳转登录页
        redirectLogin()
      }
    } else if (status === 403) {
      // 没有权限操作
      Toast.fail('没有权限操作')
    } else if (status === 404) {
      // 资源不存在
      Toast.fail('资源不存在')
    } else if (status >= 500) {
      // 服务端异常
      Toast.fail('服务端异常')
    }
    // 未处理的异常往外抛
    return Promise.reject(error)
  })
// 返回相应的登陆页
function redirectLogin () {
  // 用replcae替换当前历史记录，push会产生历史记录
  router.replace({
    name: 'login',
    // 传递查询参数
    query: {
    // 数据名是自己起的,router.currentRoute和this.$router是一个东西,如果我从首页来的，就记录首页
      redirect: router.currentRoute.fullpath
    }
  })
}
export default request
