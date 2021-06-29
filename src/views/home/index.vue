<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <template #title>
      <van-button
        class="search-btn"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索</van-button
      >
      </template>
    </van-nav-bar>
    <!-- 导航栏 -->
    <!-- 频道列表 -->
    <!--
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
      通过 animated 属性可以开启切换标签内容时的转场动画
      通过 swipeable 属性可以开启滑动切换标签页
     -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
      <!-- 文章列表 -->
        <article-list :channel="channel" />
      <!-- 文章列表 -->
      </van-tab>
       <template #nav-right>
       <div class="placeholder"></div>
        <div class="hamburger-btn" @click="isEditChannelShow=true">
         <i  class="toutiao toutgengduo" ></i>
         </div>
       </template>
    </van-tabs>
    <!-- 频道列表 -->

    <!-- 频道编辑弹出层-->
    <van-popup
     class= "edit-channel-popup"
     v-model= "isEditChannelShow"
     position= "bottom"
     :style="{ height: '80%' }"
     closeable
     close-icon-position= "top-left"
     >
     <channel-edit
     :myChannels= "channels"
     :active= "active"
     @pushMychannel= "onPushMychannel"
     @update-active= "onUpdateActive"
     @delateChannels= "onDelateChannels"
     />
     </van-popup>
  </div>
  <!-- /导航栏 -->
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { getItem } from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 1,
      channels: [], // 频道列表
      isEditChannelShow: false // 控制编辑频道列表的弹出
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    // 用来加载频道数据
    this.laodChannels()
  },
  mounted () {},
  methods: {
    async laodChannels () {
      // try {
      //   const { data } = await getUserChannels()
      //   this.channels = data.data.channels
      // } catch (err) {
      //   this.$toast('获取频道数据失败')
      // }
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []

        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          //    有，拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            //    没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }

        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onPushMychannel (editMychanel) {
      this.channels.push(editMychanel)
    },
    onUpdateActive (index, isEditChannelShow = true) {
      this.active = index
      this.isEditChannelShow = isEditChannelShow
    },
    onDelateChannels (index) {
      this.channels.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset; // 里面有个最大值取消，否则会限制搜索框的大小
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none; // 最外面取消搜索边框
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    // 被选中的颜色
    .van-tab--active {
      color: #333333;
    }
    .van-tab__nav {
      padding-bottom: 0;
    }
    // 底边被选中那根线的样式
    .van-tabs__line {
      bottom: 8px; // 距离底部8px
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
     .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
     .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
    // 频道编辑
  .edit-channel-popup {
  padding-top: 100px;
box-sizing:border-box;
  }
}
</style>
