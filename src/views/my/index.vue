<template>
  <div class="my-container">
    <!-- 已登录页面 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avater" :src="userInfo.photo" round fit="cover" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-states">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text"> 关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录页面 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push({
        name:'login',
        query: {
          redirect: '/my'
        }
      })">
        <img src="~@/assets/mobile.png" class="mobile-img" alt="" />
        <span class="text">登录/注册</span>
      </div>
    </div>

    <!-- 宫格导航一直有的 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
          <template #icon>
                <i class="toutiao toutshoucang"></i>
          </template>
          <template #text>
                 <span class="text">收藏</span>
           </template>
      </van-grid-item>
      <van-grid-item class="grid-item">
          <template #icon>
                <i class="toutiao toutlishi"></i>
          </template>
          <template #text>
                <span  class="text">历史</span>
          </template>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" class="mb-9" is-link />
    <van-cell
      v-if="user"
      clickable
      title="退出登录"
      class="logout-cell"
      @click="onLogout"
      center
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'

export default {
  name: 'myIndex',
  components: {},
  props: {},
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    // 把容器里的数据映射到当前页面中，非常方便
    ...mapState(['user'])
  },
  watch: {},
  created () {
    // 如果用户登录，则加载数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted () {},
  methods: {
    onLogout () {
      this.$dialog
        .confirm({
          title: '确定退出吗?'
        })
        .then(() => {
          this.$store.commit('setUser', null) // 确认执行这里，删除容器里的user和本地存储的user
        })
        .catch(() => {
          // 退出执行这里
        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (err) {
        console.log(err)
        this.$toast('接收数据失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png") no-repeat;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-content: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;

      box-sizing: border-box;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;
        .avater {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-states {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .count {
          font-size: 26px;
          color: #fff;
        }
        .text {
          font-size: 26px;
          color: #fff;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutshoucang {
        color: #eb5253;
      }
      .toutlishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 32px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    margin-top: 7px;
    color: #eb5253;
  }
}
</style>
