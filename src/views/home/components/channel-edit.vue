<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <template #title>
        <div class="title-text">我的频道</div>
      </template>
      <van-button
       class="edit-btn"
       type="danger"
       plain
       size="mini"
       round
       @click="isEdit = !isEdit"
        >{{isEdit? '完成':'编辑'}}
      </van-button>
    </van-cell>
    <!-- 我的频道 -->
    <van-grid
    :column-num="4"
    :gutter="10"
    class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channels, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channels, index)"
      >
      <template #icon>
          <van-icon
          v-show="isEdit && !fiexdChannels.includes(channels.id) "
          name="clear"
        ></van-icon>
      </template>
        <template #text>
          <div
          class="text"
          :class="{ active: index === active }"
          >{{ channels.name }}</div>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- 频道编辑 -->
    <van-cell>
      <template #title>
        <div class="title-text">频道编辑</div>
      </template>
    </van-cell>
    <van-grid
    clickable
    :column-num="4"
    :gutter="10"
    class="recommend-grid">
      <van-grid-item
        class="grid-item"
        v-for= "(editChannels,index) in recommendChannels"
        :key= "index"
        icon= "plus"
        :text= "editChannels.name"
        @click= "onAddChannels(editChannels)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'

import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 接收过来所有的频道
      isEdit: false, // 控制编辑状态显示
      fiexdChannels: [0, 11] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
    // filter返回值一个数组,find遍历每一个我的频道，返回第一个元素
      return this.allChannels.filter(channel => {
        return !this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道接收失败')
      }
    },
    async onAddChannels (editChannels) {
      try {
        this.$emit('pushMychannel', editChannels)
        if (this.user) {
          // 已登录，数据存储到线上
          await addUserChannel([{
            id: editChannels.id, // 频道id
            seq: this.myChannels.length // 频道的序号
          }])
        } else {
          // 未登录，数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        // this.$toast('添加频道失败')
      }
    },
    onMyChannelClick (channels, index) {
      if (this.isEdit) {
        // 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channels.id)) {
          return
        }
        // 如果是编辑状态，删除频道
        if (index <= this.active) {
        // 让频道索引激活-1
          this.$emit('update-active', this.active - 1, true)
        }
        this.$emit('delateChannels', index)
        this.deleteChannels(channels)
      } else {
        // 如果是不是编辑状态，切换我的频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannels (channels) {
      try {
        if (this.user) {
        // 已登录，将数据更新到线上
          await deleteUserChannel(channels.id)
        } else {
        // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px, 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
