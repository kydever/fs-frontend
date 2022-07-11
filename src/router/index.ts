import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
import { getToken } from '@/utils/auth'
import { toWarrant } from '@/utils/utils'

const router = createRouter({
  history: createWebHistory(),
  routes
})

NProgress.configure({
  // 动画方式
  easing: 'ease',
  // 是否显示加载ico
  showSpinner: false,
  // 自动递增间隔
  trickleSpeed: 200,
  // 初始化时的最小百分比
  minimum: 0.3
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (!getToken() && to.name !== 'login') {
    toWarrant()
    return
  }
  // 页面加载进度条
  if (to.name !== from.name) {
    NProgress.start()
  }
  window.document.title = to.meta.title ? `${to.meta.title} | 文件管理` : '文件管理'

  next()
})

router.afterEach(() => {
  NProgress.done()
})
export default router
