<template >
    <van-cell
    class="article-item"
    :to="{
            name: 'article',  // 路由的名字
            params:{
            articleId: article.art_id // 路由路径中设计的动态参数名称
            }
        }"
     >
      <template #title >
      <div  class="title"  van-multi-ellipsis--l2>{{ article.title }}</div>
      </template >
        <template #label >
         <div v-if="article.cover.type === 3" class="cover-wrap">
          <div
            class="cover-item"
            v-for="(img,index) in article.cover.images"
            :key="index"
          >
          <van-image
            class="cover-item-img"
            :src= "img"
           />
          </div>
        </div>
        <div class="label-info-wrap">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ filterDate(article.pubdate)}} </span>
        </div>
      </template>
      <template #default>
      <van-image
        v-if="article.cover.type === 1"
        class="right-cover"
        fit="cover"
        :src="article.cover.images[0]"
      />
      </template>
    </van-cell>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {},
  created () {
  },
  mounted () {},
  methods: {
    filterDate (value) {
      return dayjs().from(dayjs(value))
    }
  }
}
</script>

<style scoped lang="less">
.article-item {

  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value{
    display:flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .van-cell__value {
    flex:unset; // 文字不设置flex属性
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 100%;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
