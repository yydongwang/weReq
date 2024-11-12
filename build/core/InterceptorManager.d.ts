export interface fulfilled<T = any> {
    (val: T): T | Promise<T>;
}
export interface Rejected {
    (error: any): any;
}
interface Interceptor<T> {
    fulfilled?: fulfilled<T>;
    rejected?: Rejected;
}
export default class InterceptorManager<T> {
    private readonly interceptors;
    constructor();
    use(fulfilled?: fulfilled<T>, rejected?: Rejected): number;
    forEach(fn: (interceptor: Interceptor<T>) => void): void;
    eject(id: number): void;
}
export {};
