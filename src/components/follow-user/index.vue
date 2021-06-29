<template>
         <van-button
          v-if="isFollowed"
            class="follow-btn"
            round
            size="small"
            :loading= "loading"
            @click="onFollow"
          >已关注
          </van-button>
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading= "loading"
            @click="onFollow"
          >关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: 'isFollowed', // 默认是 value
    event: 'update-is_followed' // 默认是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {
  // this.loadArticle()
  },
  mounted () {},
  methods: {
    async onFollow () {
      this.loading = true // 已发送请求就给关注按钮加loading
      try {
        if (this.isFollowed) {
        // 如果用户关注，就取消关
          await deleteFollow(this.userId)
        // 此父组件发起请求,取消关注
        } else {
        // 如果用户未关注，就添加关注
          await addFollow(this.userId)
        }
        // 更新视图状态
        this.$emit('update-is_followed', !this.isFollowed)
        this.$toast(`${this.isFollowed === true ? '取消关注' : '关注成功'} `)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast('你不能关注你自己')
        } else {
          this.$toast('您未登录，请先登录!')
          this.$router.push({
            name: 'login',
            query: {
              redirect: `/article/${this.articleId}`
            }
          })
        }
      }
      this.loading = false // 请求结束，关闭按钮
    }
  }
}
</script>

<style>

</style>
