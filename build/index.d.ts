import { RequestConfig } from './type';
import Request from './core/Request';
declare let weReq: {
    init: (config: RequestConfig) => Request;
};
export default weReq;
