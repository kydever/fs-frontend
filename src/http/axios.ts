/* eslint-disable new-cap */
import axios from 'axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth'
import { toWarrant } from '@/utils/utils'

// 创建axios实例
const service = axios.create({
  baseURL: '',
  timeout: 300000
})

// 添加请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token: string = getToken()
    // config.headers['token'] = token
    config.headers['work-wx-token'] = token || ''
    // const route = router.currentRoute.value
    // // 测试mock数据，可删除
    // if (route.path === '/base/mock' && config.url == '/api/getTableList') {
    //   config.baseURL = ''
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (res: AxiosResponse) => {
    const { data, status } = res
    const code = data.code
    if (status !== 200) {
      ElMessage.closeAll()
      ElMessage({
        message: data.status.msg || data.status.message || 'error',
        showClose: true,
        type: 'error',
        duration: 4000
      })
      return Promise.reject(data.status)
    }
    switch (code) {
      case 700:
        toWarrant()
        break
      case 0:
        return data.data
      default:
        ElMessageFun(data.message)
        break
    }
  },
  (err) => {
    // 对响应错误做点什么
    if (err && err.response) {
      switch (err.response.status) {
        case 404:
          ElMessageFun(`请求地址出错: ${err.response.config.url}`)
          break
        default:
          errorMessage(err.response.status)
          break
      }
    } else {
      ElMessageFun('请求失败！')
    }
    // 对响应错误做点什么
    return Promise.reject(err)
  }
)

function errorMessage(status) {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误'
      break
    case 401:
      message = '未授权，请登录'
      break
    case 403:
      message = '拒绝访问'
      break
    case 408:
      message = '请求超时'
      break
    case 500:
      message = '服务器内部错误'
      break
    case 501:
      message = '服务未实现'
      break
    case 502:
      message = '网关错误'
      break
    case 503:
      message = '服务不可用'
      break
    case 504:
      message = '网关超时'
      break
    case 505:
      message = 'HTTP版本不受支持'
      break
    default:
      message = '系统错误'
      break
  }
  ElMessageFun(message)
}

function ElMessageFun(parems) {
  ElMessage.closeAll()
  ElMessage({
    message: parems,
    showClose: true,
    type: 'error',
    duration: 4000
  })
}

export default service
