import {
  RequestConfig,
  Response,
  autoLoginConfig,
  InterceptorManagers,
  reTokenConfigMethod
} from '../type'
import InterceptorManager from './InterceptorManager'
import dispatchRequest from './dispatchRequest'
import Loading from './Loading'
import { isAbsoluteURL, combineURLs } from '../utils'

class Request {
  private config: RequestConfig
  private autoLoginConfig?: autoLoginConfig
  private interceptorsManagers: InterceptorManagers
  private loading: Loading
  private retryAttempts: number
  private isRefreshing: boolean
  private failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (reason?: any) => void
  }>
  constructor(config: RequestConfig) {
    this.config = config
    this.loading = new Loading()
    this.isRefreshing = false
    this.failedQueue = []
    this.retryAttempts = 0
    this.autoLoginConfig = config.autoLoginConfig
    this.interceptorsManagers = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
    if (config.interceptors) {
      this.interceptorsManagers.request.use(
        config.interceptors.requestSuccessFn,
        config.interceptors.requestFailFn
      )
      this.interceptorsManagers.response.use(
        config.interceptors.responseSuccessFn,
        config.interceptors.responseFailFn
      )
    }
  }
  // 获取登录态的 code
  private login(): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(new Error(`获取用户登录态失败！${res.errMsg}`))
          }
        },
        fail: reject
      })
    })
  }
  // 获取服务器token
  private refreshTokenFn(code: string) {
    return new Promise<any>((resolve, reject) => {
      const { reTokenConfig } = this.autoLoginConfig!
      const {
        url,
        method = 'GET',
        codeKey = 'code',
        headers = {},
        data: configData = {}
      } = reTokenConfig // 解构获取配置信息
      let requestUrl = url
      let requestData: Record<string, any> = configData

      // 拼接 baseURL
      if (!isAbsoluteURL(requestUrl) && this.config.baseURL) {
        requestUrl = combineURLs(this.config.baseURL, requestUrl)
      }

      // GET 请求时，将参数拼接到 URL 中
      if (method.toUpperCase() === 'GET') {
        // 判断是否已有查询参数
        const hasQuery = requestUrl.includes('?')
        const connector = hasQuery ? '&' : '?'
        requestUrl += `${connector}${codeKey}=${code}`
      } else {
        // 避免修改原始 configData
        requestData = { [codeKey]: code, ...configData }
      }
      wx.request({
        url: requestUrl,
        method: method.toUpperCase() as reTokenConfigMethod, // 强制转换为正确的枚举类型
        data: requestData,
        header: headers,
        success: (res: any) => {
          if (res) {
            resolve(res)
          } else {
            reject(new Error('获取用户token失败！' + res.errMsg))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }
  // 处理响应
  private handleResponse(res: Response, config: RequestConfig): Promise<any> {
    return new Promise<any>((resolve) => {
      if (
        this.autoLoginConfig?.reTokenConfig &&
        this.autoLoginConfig.isTokenExpiredFn(res)
      ) {
        this.handleTokenRefresh()
          .then(() => {
            this.request(config).then(resolve)
          })
          .catch(() => {
            if (config.loading) {
              this.loading.hide()
            }
          })
      } else {
        this.retryAttempts = 0
        resolve(res)
        if (config.loading) {
          this.loading.hide()
        }
      }
    })
  }

  // 处理 token 刷新并重新执行一遍token过期的网络请求
  async handleTokenRefresh() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({
          resolve,
          reject
        })
      })
    }
    this.isRefreshing = true
    // 如果已经超过最大重试次数，拒绝刷新 token
    if (this.retryAttempts >= (this.autoLoginConfig?.reLoginLimit || 3)) {
      this.isRefreshing = false
      return Promise.reject(new Error('刷新 token 达到最大重试次数'))
    }
    const code = await this.login()
    const refreshTokenPromise = this.refreshTokenFn(code)
    this.retryAttempts++
    return new Promise((resolve, reject) => {
      refreshTokenPromise
        .then((data) => {
          this.autoLoginConfig?.reTokenConfig.success(data)
          this.isRefreshing = false
          this.failedQueue.forEach(({ resolve }) => resolve(data))
          this.failedQueue = []
          resolve(data)
        })
        .catch((error) => {
          this.isRefreshing = false
          this.failedQueue.forEach(({ reject }) => reject(error))
          this.failedQueue = []
          reject(error)
        })
    })
  }
  async request(uniConfig: any): Promise<any> {
    const config = { ...this.config, ...uniConfig }
    if (config.loading) {
      this.loading.show(config.loading)
    }
    if (uniConfig?.interceptors?.requestSuccessFn)
      uniConfig.interceptors.requestSuccessFn(uniConfig)
    let chain = [dispatchRequest, undefined]
    // 注意 forEach 来自于InterceptorManager这个类的方法，非数组方法
    this.interceptorsManagers.request.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })
    this.interceptorsManagers.response.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })
    //  处理拦截器
    let promise = Promise.resolve(config)
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    // 处理响应并判断是否需要刷新token
    return promise.then(
      (res) => this.handleResponse(res, config),
      () => {}
    )
  }

  // HTTP 方法
  get(uniConfig: RequestConfig) {
    return this.request({ method: 'GET', ...uniConfig })
  }
  post(uniConfig: RequestConfig) {
    return this.request({ method: 'POST', ...uniConfig })
  }
  delete(uniConfig: RequestConfig) {
    return this.request({ method: 'DELETE', ...uniConfig })
  }
}
export default Request
