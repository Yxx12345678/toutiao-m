<template>
  <div class="search-history">
   <van-cell title="搜索历史">
       <div v-if="isDeleteShow">
       <span @click="$emit('deleteAllHistory')">全部删除</span>
       <span @click="isDeleteShow = false">完成</span>
       </div>
     <van-icon  v-else name="delete" @click="isDeleteShow = true"/>
   </van-cell>
   <van-cell
   :title="item"
   v-for="(item,index) in searchHistory"
   :key="index"
   @click="onSearchHistoryClick(item,index)">
     <van-icon  v-if="isDeleteShow" name="close"/>
   </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearchHistoryClick (item, index) {
      if (this.isDeleteShow) {
        // 如果是删除状态，就进行删除
        this.$emit('deleteHistory', index)
      } else {
        // 如果不是删除状态下，点击进入
        this.$emit('historySearch', item)
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
