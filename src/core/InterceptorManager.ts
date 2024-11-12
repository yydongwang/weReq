export interface fulfilled<T = any> {
  (val: T): T | Promise<T>
}

export interface Rejected {
  (error: any): any
}

interface Interceptor<T> {
  fulfilled?: fulfilled<T>
  rejected?: Rejected
}

export default class InterceptorManager<T> {
  private readonly interceptors: Array<Interceptor<T> | null>
  constructor() {
    this.interceptors = []
  }

  use(fulfilled?: fulfilled<T>, rejected?: Rejected): number {
    this.interceptors.push({ fulfilled, rejected })
    return this.interceptors.length - 1
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
