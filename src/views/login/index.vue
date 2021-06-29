<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
      <van-icon  name="cross" @click="$router.back()" />
      </template>
       </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-cell-group>
        <van-field
          v-model="user.mobile"
          name="mobile"
          placeholder="请输入手机号"
          :rules="userFormRules.mobile"
          type="number"
          maxlength="11"
        >
       <template #left-icon>
          <i class="toutiao toutshouji"></i>
       </template>
        </van-field>
        <van-field
          v-model="user.code"
          name="code"
          type="number"
          placeholder="请输入验证码"
          :rules="userFormRules.code"
          maxlength="6"
        >
       <template #left-icon>
          <i  class="toutiao toutyanzhengma"></i>
       </template >
          <template #button>
            <!-- 倒计时 -->
            <van-count-down
              v-if="isCountDownShow"
              :time="1000 * 10"
              format="ss s"
              @finish="isCountDownShow = false"
            />
            <van-button
              v-else
              class="send-sms-btn"
              native-type="button"
              round
              size="small"
              type="default"
              @click="onSendSms"
              >发送验证码</van-button
            >
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user' //  获取服务器得到的数据
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'// 输入不满足的提示信息
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '输入的手机号不符合规则'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空' // 输入不满足的提示信息
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false //  是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    //  发送验证码
    async onSendSms () {
      try {
        // 1.验证手机号
        await this.$refs.loginForm.validate('mobile') //  如果不传参数，整个表单都会被验证
      } catch (err) {
        return console.log('验证失败', err) //  手机号验证不通过，直接不往下走
      }
      //  2.验证通过，倒计时
      this.isCountDownShow = true
      //  3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        //  4.发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    },
    //  提交表单
    async onSubmit () {
      // 获取表单数据
      // const user = this.user
      // 表单验证
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })

      // 提交表单请求登录

      try {
        const { data } = await login(this.user) // 用await接收返回的数据，返回的是promise实例对象
        this.$store.commit('setUser', data.data) // 把data里的data的taken和refresh_taken存进去
        this.$toast.success('登录成功') // 新的toast都会把之前的toast关闭
        // 登录成功后，让它清除layout的缓存，重新渲染
        this.$store.commit('removeCachePages', 'LayoutInedx')

        //  this.$router.back() // 登陆成功，返回原来的页面,方式有问题
        this.$router.push(this.$route.query.redirect || '/') // 如果没有就跳转回首页
      } catch (err) {
        if (err.response.status === 400) {
          console.log('登录失败', err)
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
