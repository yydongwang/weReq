import InterceptorManager from './core/InterceptorManager'

export enum reTokenConfigMethod {
  GET = 'GET',
  POST = 'POST'
}
interface ReTokenConfig {
  url: string
  method: reTokenConfigMethod
  codeKey: string
  data: Record<string, any>
  headers: Record<string, any>
  success: (res: any) => void
  fail: (err: any) => void
}

export interface Interceptors {
  requestSuccessFn?: (
    config: RequestConfig
  ) => Promise<RequestConfig> | RequestConfig
  requestFailFn?: (error: any) => Promise<any> | any
  responseSuccessFn?: (response: Response) => Promise<any> | any
  responseFailFn?: (error: any) => Promise<any> | any
}

export interface autoLoginConfig {
  reTokenConfig: ReTokenConfig
  isTokenExpiredFn: (response: Response) => boolean // 检查 Token 是否过期的方法
  reLoginLimit?: number
}

export interface InterceptorManagers {
  request: InterceptorManager<any>
  response: InterceptorManager<any>
}

export interface WeAppRequestConfig {
  [key: string]: any
  baseURL?: string
  loading?: boolean
  interceptors?: Interceptors
  autoLoginConfig?: autoLoginConfig
}

export type RequestConfig = WechatMiniprogram.RequestOption & WeAppRequestConfig
export type Response = WechatMiniprogram.RequestSuccessCallbackResult<
  string | Record<string, any> | ArrayBuffer
>
