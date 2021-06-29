<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="onClickLeft"
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap"  v-if="loading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div
      class="article-detail "
      v-else-if="article.content"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
        <template #icon>
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="article.aut_photo"
          />
        </template>
         <template #title>
        <div class="user-name">{{article.aut_name}}</div>
          </template>
         <template #label>
        <div class="publish-date">{{ filterDate(article.pubdate) }}</div>
         </template>

         <!-- 关注按钮子组件 -->
         <follow-user
         class="follow-btn"
         v-model= "article.is_followed"
         :user-id = "article.aut_id"
         :article-id = "articleId"
         />
        </van-cell>
        <!-- 文章内容 -->
        <div class="article-content"
        v-html="article.content"
        ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404" >
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
        class="retry-btn"
        @click ="loadArticle"
        >点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
      >写评论</van-button>
      <van-icon
        name="comment-o"
        info="123"
        color="#777"
      />
      <!-- 文章收藏 -->
      <!-- <van-icon
        :color="article.is_collected?'orange':'#777'"
        :name="article.is_collected?'star':'star-o'"
        @click="onCollect"
      /> -->
      <!-- 文章点赞 -->
      <!-- <van-icon
        color="#777"
        name="good-job-o"
      /> -->
       <!-- 收藏子组件按钮 -->
        <collect-article
        :is-collect= "this.article.is_collected"
        :article-id = "articleId"
        v-on:input="article.is_collected==true? article.is_collected = false: article.is_collected=true"
        />
        <!-- 点赞子组件 -->
        <like-article
        :is-like= "this.article.attitude"
        :article-id = "articleId"
        v-on:input="article.attitude===1?article.attitude = 0: article.attitude = 1"
        />
      <!-- 文章分享 -->
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  getArticleById
  // addCollect,
  // deleteCollect
} from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},
      loading: true,
      errStatus: 0,
      FollowLoading: false,
      isCollectLoading: false

    }
  },
  computed: {
  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    filterDate (value) {
      return dayjs().from(dayjs(value))
    },
    async loadArticle () {
      // 一进来就加载函数
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('JIGHDD')
        // }
        this.article = data.data
        // 加载文章预览，但是数据驱动视图不是立即的，可以放到一个延时器中
        setTimeout(() => {
          this.preViewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
          this.$toast('获取文章失败')
        }
      }
      // 无论成功还是失败都需要关闭加载状态
      this.loading = false
    },
    onClickLeft () {
      this.$router.back()
    },
    preViewImage () {
    // 获取img节点
      const contentDom = this.$refs['article-content']
      const imgs = contentDom.querySelectorAll('img')
      console.log(imgs)
      const images = [] // 创建一个空数组，获取存储图片的url地址
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images, // 图片预览传的地址
            startPosition: index // 图片起始位置
          })
        }
      })
    }
    // async onCollect () {
    //   this.isCollectLoading = true
    //   // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
    //   this.$toast.loading({
    //     duration: 0, // 持续展示 toast
    //     message: '操作中...',
    //     forbidClick: true // 是否禁止背景点击
    //   })

    //   try {
    //   // 如果已收藏，则取消收藏
    //     if (this.article.is_collected) {
    //       await deleteCollect(this.articleId)
    //       // this.article.is_collected = false
    //     } else {
    //       // 添加收藏
    //       await addCollect(this.articleId)
    //       // this.article.is_collected = true
    //     }
    //     this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    //     this.article.is_collected = !this.article.is_collected
    //   } catch (err) {
    //     console.log(err)
    //     this.$toast.fail('操作失败')
    //   }
    //   this.isCollectLoading = false
    // }
  }
}
</script>

<style scoped lang="less">
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      font-size: 30px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
