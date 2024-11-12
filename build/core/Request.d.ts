import { RequestConfig } from '../type';
declare class Request {
    private config;
    private autoLoginConfig?;
    private interceptorsManagers;
    private loading;
    private retryAttempts;
    private isRefreshing;
    private failedQueue;
    constructor(config: RequestConfig);
    private login;
    private refreshTokenFn;
    private handleResponse;
    handleTokenRefresh(): Promise<unknown>;
    request(uniConfig: any): Promise<any>;
    get(uniConfig: RequestConfig): Promise<any>;
    post(uniConfig: RequestConfig): Promise<any>;
    delete(uniConfig: RequestConfig): Promise<any>;
}
export default Request;
