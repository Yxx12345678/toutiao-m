<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error= error
      error-text="加载失败，请重新加载"
    >
      <van-cell
      v-for="(article,index) in list"
      :key="index"
      :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      page: 1,
      perPage: 20,
      loading: false,
      finished: false,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      //   // 异步更新数据
      //   setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //       this.list.push(this.list.length + 1)
      //     }
      //     // 加载状态结束
      //     this.loading = false
      //     // 数据加载结束完成
      //     if (this.list.length >= 40) {
      //       this.finished = true
      //     }
      //   }, 1000)

      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText // 搜索关键字
        })
        const { results } = data.data
        this.list.push(...results)
        // 此次加载结束
        this.loading = false
        // 判断错误的条件
        // if (Math.random() > 0.5) {
        //   JSON.parse('BHJI')
        // }
        // 判断是否还有数据
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        // 加载失败，loading也要关闭
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
