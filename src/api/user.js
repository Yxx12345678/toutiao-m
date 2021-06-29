/**
 * 用户相关的请求模块
 */
import request from '@/utils/request'
import store from '@/store'
/**
 * 用户登录（data是服务器返回的数据）
 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations', // 请求地址的最终路径
    data // post准备添加的数据
  })
}
// 发送验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}` // es6字符串拼接
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user',
    // es6字符串拼接
    // 发送请求头数据，后台数据需要这个发请求的时候包含这个头部的命令，并且格式固定，Bearer
    // 后面有个空格
    headers: {
      Authorization: `Bearer ${store.state.user.token} `
    }
  })
}
// 获取用户自己的频道
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
// 获取频道的文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
/**
 * 添加关注
 */
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  })
}

/**
 * 取消关注
 */
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
