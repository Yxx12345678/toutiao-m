<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model= "isreFreshLoading"
      :success-text= "refreshSuccessText"
      :success-duration= " 1500 "
      @refresh= "onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/user'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 是否进行加载
      finished: false, // 控制数据加载结束时候的状态
      error: false, // 是否加载失败
      timestamp: null, // 请求下一页数据的时间戳
      isreFreshLoading: false,
      refreshSuccessText: '刷新成功', //  :success-duration= " 1500 "
      scrollTop: 0
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.scrollTop = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    // 缓存之后会被激活,把记录到top的距离再设回去
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  methods: {
    // 初始化或滚动到底部时候回触发onload
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据的时间戳，请求历史推荐指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次要包含置顶文章，1-包含置顶，0-不包含
        })

        // 测试数据有问题
        // if(Math.random()>0.5){
        //   JSON.parse('huihdcug')
        // }
        // 把数据添加到list数组中
        const { results } = data.data
        this.list.push(...results)
        // 设置本次loading的状态结束
        this.loading = false
        // 判断数据是否加载结束
        if (results.length) {
          // 更新下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.loading = false // 关闭loading效果
        this.error = true // 开启错误提示
      }
    },
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now(), // 时间戳，下拉每次获得最新的数据
          with_top: 1 // 是否包含置顶，进入页面第一次要包含置顶文章，1-包含置顶，0-不包含
        })
        // 将数据追加到列表顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 关闭下拉刷新的loading状态
        this.isreFreshLoading = false
        // 提示成功
        this.refreshSuccessText = `刷新了${results.length}条数据`
      } catch (err) {
        this.isreFreshLoading = false // 关闭下拉刷新的loading状态
        this.error = true // 开启错误提示
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list{
  height: 79vh;
  overflow-y:auto ;
}
</style>
