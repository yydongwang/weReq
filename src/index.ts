import { RequestConfig } from './type'
import Request from './core/Request'

const init = function (config: RequestConfig) {
  return new Request(config)
}
let weReq = { init }
export default weReq
