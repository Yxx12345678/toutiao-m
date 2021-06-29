<template>
  <div class="search-suggestion">
    <van-cell
    icon="search"
    v-for="(text,index) in suggestionMessage"
    :key ="index"
    @click="$emit('search',text)"
    >
    <template #title>
    <div v-html= "hightlight(text)" class="title"></div>
    </template>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestionMessage: []
    }
  },
  computed: {},
  watch: {
    searchText: {
    //   handler (value) {
    //     this.loadSuggestionMessage(value)
    //   },
      handler: debounce(function (value) {
        this.loadSuggestionMessage(value)
      }, 200),
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSuggestionMessage (q) {
      try {
        const { data } = await getSearchSuggestion(q)
        this.suggestionMessage = data.data.options
      } catch (err) {
        this.$toast('请求联想数据失败')
      }
    },
    hightlight (text) {
      const hightlightstr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightlightstr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion{
 /deep/ .title{
     .active{
        color:#3692fa
        }
    }

}
</style>
