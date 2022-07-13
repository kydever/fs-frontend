<template>
  <div class="login-wrap">
    <div class="login">
      <div class="main-left_img">
        <img src="@/assets/imgs/login-bg.png" alt="" />
      </div>
      <div class="login-model">
        <el-button type="primary" :loading="loginLoading" @click="loginFun">
          登 录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { setToken, setCookies } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
import { useRoute } from 'vue-router'
import { postLoginCode } from '@/api/login'
import { KYUSERINFO } from '@/constant/login'

export default defineComponent({
  setup() {
    const loginLoading = ref(false)
    const one = ref(true)
    const route = useRoute()
    onMounted(() => {
      window.addEventListener('keyup', enterClick)
    })
    // 回车事件
    const enterClick = (event) => {
      if (loginLoading.value || event.keyCode !== 13) return
      loginFun()
    }

    // 触发登录
    const loginFun = async() => {
      window.location.href = `/api/oauth/authorize?redirect_uri=${window.location.href}`
      loginLoading.value = true
    }
    onBeforeUnmount(() => {
      window.removeEventListener('keyup', enterClick)
    })
    const loginCode = async () => {
      const code = route.query.code as string
      if (code) {
        if(!one.value) return
        one.value = false
        try {
          const { token, user } = await postLoginCode({ code: code })
          setToken(token)
          store.commit('user/updateUserInfo', user)
          setCookies(KYUSERINFO, user)
          router.push('/home')
        } catch (error) {
          router.push('/login')
          loginLoading.value = false
        }
      }
    }
    loginCode()
    return {
      loginLoading,
      loginFun
    }
  }
})
</script>
<style lang="scss" scoped>
.login-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #f5f6fa;
}

.main-left_img {
  flex-shrink: 0;
  width: 665px;
  height: 568px;

  img {
    width: 100%;
  }
}

.login {
  height: 100%;
  min-height: 545px;
  min-width: 1000px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
  box-sizing: border-box;
}

.login-model {
  width: 440px;
  margin-left: 190px;
  flex-shrink: 0;
  button{
    width: 100%;
    padding: 20px 0;
  }
}

</style>
