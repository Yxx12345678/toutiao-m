<template>
  <div class="search-container">
      <!-- 搜索栏 -->
    <!--
      Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮
     -->
    <form class="search-from" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search= "onSearch"
        @cancel= "onCancel"
        @focus= " isResultShow = false "
      />
    </form>
    <!-- /搜索栏 -->
      <!-- 历史结果 -->
  <search-result
  v-if= "isResultShow"
  :search-text = "searchText"
  />
   <!-- 历史结果 -->

    <!-- 联想建议 -->
  <search-suggestion
  v-else-if= "searchText"
  :search-text = "searchText"
  @search="onSearch"
  />
    <!-- 联想建议 -->

   <!--  搜索历史记录-->
  <search-history
  v-else
  :search-history="searchHistories"
  @search="onSearch"
  @deleteHistory="onDeleteHistory"
  @deleteAllHistory="onDeleteAllHistory"
  @historySearch="onSearch"
  />
   <!--  搜索历史记录-->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchPage',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  props: {},
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORY') || []
    }
  },
  computed: {},
  watch: {
    searchHistories (value) {
      setItem('TOUTIAO_SEARCH_HISTORY', value)
    }
  },
  created () {},
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val

      // 看当前历史记录里有没有重复的搜索内容，如果有清除存入，如果没有直接存入历史记录数组的最上方
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back('/serach')
    },
    onDeleteHistory (index) {
      this.searchHistories.splice(index, 1)
    },
    onDeleteAllHistory () {
      this.searchHistories = []
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
    padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
      position: fixed;
      top:0;
      left:0;
      right:0;
      z-index: 1;
  }
}
</style>
