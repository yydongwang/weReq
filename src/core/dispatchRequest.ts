import { RequestConfig } from '../type'
import { isAbsoluteURL, combineURLs } from '../utils'
function dispatchRequest(config: RequestConfig) {
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url)
  }
  config.method = config.method?.toUpperCase() as any
  return new Promise<any>((resolve, reject) => {
    wx.request({
      ...config,
      success: (res) => {
        try {
          resolve(res)
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}
export default dispatchRequest
