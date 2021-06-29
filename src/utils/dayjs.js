import dayjs from 'dayjs'
import Vue from 'vue'
// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 处理相对时间的文件包
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 过滤器接口函数
// export const relativeTime = value => {
//   return dayjs().from(dayjs(value))
// }

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().from(dayjs(value))
})
