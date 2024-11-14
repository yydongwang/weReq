# weReq

## weReq是什么

`weReq` 是基于微信小程序的 `wx.request` 的高级封装，提供全局和外部拦截器的管理，支持自动登录等功能，旨在简化微信小程序网络请求的处理流程，提升开发者的使用体验。

## 特性

- **支持 Promise API**：该类支持 `async/await` 和 `then`，使得异步操作更加简洁，避免了回调地狱的复杂性，提升了代码可读性。
- **拦截请求和响应**：内置多种拦截器机制允许开发者在请求和响应阶段进行一系列处理，仅返回业务数据，简化了对返回信息的操作。
- **自带 Loading**：基于微信的wx.showLoading的方法在发起请求时自动显示加载提示，确保请求完成后自动隐藏，提升交互体验。
- **自动登录**：在登录态过期时，系统会自动尝试重新登录，整个过程对开发者是透明的，无需手动处理，对用户是无感知的，提高了用户体验。

## 下载与安装

### 源码下载引入

步骤1：[点击这里](https://github.com/yydongwang/weReq)下载 `weReq` 源码，将解压后的文件夹中的weReq.min拷贝到小程序项目中的 `utils` 目录下。引用 `weReq` 并初始化。

步骤2：import Request from '../utils/weReq.min.js';

### npm安装

使用 npm 构建前，请先阅读微信官方的 [npm 支持](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

步骤1：npm install weReq

步骤2： 构建 npm，点击开发者工具中的菜单栏：工具 --> 构建 npm

步骤3：完成前两步骤就可以引入啦，import Request from 'we-req'

## 使用示例

```javascript
import Request from 'we-req';  //或者 import Request from '../utils/weReq.min.js';
const weReq = Request.init({
  baseURL: 'https://api.example.com',
  timeout：3000,
  ...
});
// 发起 GET 请求
weReq.get({ url: '/endpoint' })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });

// 发起 POST 请求
weReq.post({ url: '/endpoint',data:{name:"我是小明"} })
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
```

更多丰富示例可以查看demo，链接[quick-start](https://github.com/yydongwang/weReq-demo)。

## weReq API

### 创建一个实例

```javascript
import Request from 'we-req'
const weReq = Request.init({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  ...config
})
```

### 实例方法

以下是可用的实例方法，实例方法的配置将与实例的配置合并，如果有相同的字段，实例方法传过来的字段替换实例方法的字段。

weReq#request(config)

weReq#get(config)

weReq#delete(config)

weReq#post(config)

### 请求配置(config)

> 部分参数请参考小程序本身配置， [传送门](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)。

| 参数          | 类型                      | 默认值           | 必填 | 说明                                                                                                                                                                                               |
| ------------- | ------------------------- | ---------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url           | string                    |                  | 是   | 开发者服务器接口地址                                                                                                                                                                               |
| data          | string/object/ArrayBuffer |                  | 否   | 请求的参数                                                                                                                                                                                         |
| baseURL       | string                    |                  | 否   | 会自动添加到 url 前，除非 url 是一个绝对 URL，它可以通过设置一个 `baseURL` 便于后面的请求方法传递相对 URL，不用每次请求带上域名。                                                                  |
| timeout       | number                    | 3000             | 否   | 超时时间，单位为毫秒。默认值为 60000                                                                                                                                                               |
| method        | string                    | GET              | 否   | HTTP 请求方法                                                                                                                                                                                      |
| headers       | object                    | application/json | 否   | 请求发送时候的请求头                                                                                                                                                                               |
| loading       | boolean/string            | false            | 否   | 请求过程页面是否展示全屏的加载框，默认文字是加载中，当值为字符串时，将替换loading的文字                                                                                                            |
| interceptors  | object                    | false            | 否   | 拦截器，在请求前或响应的时候对数据做拦截，可以对请求参数做一些处理或对响应数据做处理，比如：自定义加载框、发送前可以对 config 进行修改、在收到响应后可以对 res 进行处理或转换等。                  |
| reLoginConfig | object                    | false            | 否   | 登录管理器，对一些开发者，需要拿到小程序登录凭证，带到给服务器结合并返回服务器的数据做处理，当session_key过期的时候会自动登录，并重新请求session_key过期的时候的网络请求，做到用户无感知登录过程。 |

### 全屏加载框(loading)

简单来说，减少每次网络请求前，都要手写一遍，网络正在加载中。

**示例代码**

```javascript
import Request from 'we-req'
const weReq = Request.init({
  baseURL: 'https://wx.mock.com/api/',
  timeout: 3000,
  //开启全局加载弹窗
  loading: true
})

//发起 POST 请求，自带加载框
weReq
  .post({
    url: '/endpoint',
    data: {
      name: '我是小明'
    }
  })
  .then((response) => {
    console.log(response)
  })
  .catch((error) => {
    console.error(error)
  })

// 当我某个请求突然不想用全局加载框了，也可去掉
weReq
  .post({
    url: '/endpoint',
    loading: false,
    data: {
      name: '我是小明'
    }
  })
  .then((response) => {
    console.log(response)
  })
  .catch((error) => {
    console.error(error)
  })
```

### 拦截器（interceptors）

拦截器，顾名思义，在请求前或响应的时候对数据做拦截，可以对请求参数做一些处理或对响应数据做处理，比如：实现自定义加载框、发送前可以对 config 进行修改、在收到响应后可以对 res 进行处理或转换等。

**interceptors参数对象说明**

| 参数              | 类型     | 默认值 | 必填 | 说明           |
| ----------------- | -------- | ------ | ---- | -------------- |
| requestSuccessFn  | Function |        | 否   | 请求前拦截器   |
| requestFailFn     | Function |        | 否   | 请求失败拦截器 |
| responseSuccessFn | Function |        | 否   | 响应成功拦截器 |
| responseFailFn    | Function |        | 否   | 响应失败拦截器 |

**示例代码**

```javascript
import Request from 'we-req';
const weReq =  Request.init({
  baseURL: 'https://wx.mock.com/api/',
  timeout: 3000,
  interceptors: {
  // 请求成功拦截器
  requestSuccessFn: (config) => {
    // 在请求发送前可以对 config 进行修改
    return config;
  },
  // 请求失败拦截器
  requestFailFn: (err) => {
    // 可选：处理请求失败的情况，如记录日志或提示用户
  },
  // 响应成功拦截器
  responseSuccessFn: async (res) => {
    // 在收到响应后可以对 res 进行处理或转换
    return res;
  },
  // 响应失败拦截器
  responseFailFn: (err) => {
    // 可选：处理响应失败的情况，如显示错误信息或重试请求
  },
});
```

### 自动登录（reLoginConfig）

简单来说，**小程序登录是通过 `code` 换取 `session_key` 的过程，过通过 Header 携带 `sessionId`发送后端**。

当 `session_key` 过期时，我们需要用新的 `code` 获取新的 `session_key`，然后继续发起请求。

那么，问题来了，因为每个请求都需要携带 `session_key`，如果用户在访问某个页面的时候时突然 `session_key` 过期了，那该页面数据就获取不了了，无法渲染，页面出现空白，在这种情况下，我们需要重新获取用户的 `code`，以换取新的 `session_key`，并重新获取页面数据的方法，重新渲染页面数据。

`weReq` 的自动登录就是为此而生，我们约定登录过期状态（默认是 `res.code === -220`，可根据服务器判断调整）,当检测到过期时，`weReq` 会自动调用 `wx.login` 重新获取 `code`，再通过 `code` 调用登录接口获取新的 `sessionId`，通过 Header 携带 `sessionId`，最后重新发起sessionId过期之前的所有网络的请求。

这样，用户将无感知地自动登录，并自动重新调用该网络请求，这些操作都不用自己重新写是不是很方便哩。

**autoLoginConfig参数对象说明**

| 参数             | 类型     | 默认值 | 必填 | 说明                                                                                                                                         |
| ---------------- | -------- | ------ | ---- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| reTokenConfig    | Object   |        | 是   | 当token过期的时候，调用该方法，这里是填调用该方法的配置                                                                                      |
| isTokenExpiredFn | Function |        | 是   | 判断token过期的状态码，这个根据自己服务器代码返回来判断,举例我这边的的状态码为-220为过期，当所请求返回-220的时候则会自动调用登录网络请求接口 |
| reLoginLimit     | Number   | 3      | 否   | 当重试请求登录接口返回失败次数超过这个次数，将不再重试登录请求。                                                                             |

**reTokenConfig参数对象说明**

| 参数    | 类型     | 默认值 | 必填 | 说明                                                                                                                                       |
| ------- | -------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| url     | String   |        | 是   | 获取token的网络请求url ,它可以通过设置一个 `baseURL` 便于后面的请求方法传递相对 URL，不用每次请求带上域名,如果是绝对url将默认以绝对url优先 |
| method  | Function |        | 是   | GET\|POST,如果是GET请求,code将会自动拼接到url后面，如果是POST请求将会放入data传到后端                                                      |
| codeKey | String   | code   | 否   | 决定你的code传入的key的变量名字，如GET请求时/code?=123456,POST请求为{code:"123456"}                                                        |
| data    | Object   |        | 否   | 其他参数                                                                                                                                   |
| success | Function |        | 否   | 请求成功的回调，可在此存储你需要的业务，如：存储token到本地存储                                                                            |

**示例代码**

```javascript
import Request from 'we-req'
const weReq = Request.init({
  baseURL: 'https://wx.mock.com/api/',
  //获取本地token，放到请求拦截器，每次网络请求前带上token
  interceptors: {
    requestSuccessFn: (config) => {
      const key = wx.getStorageSync('token')
      config.header = {}
      config.header.Authorization = `Bearer ${key}`
      config.data = {
        ...config.data
      }
      return config
    }
  },
  reLoginConfig: {
    // 当token过期的时候刷新token并存储到本地
    reTokenConfig: {
      url: '/refresh_token',
      method: 'POST',
      data: {},
      success: (res) => {
        // 根据自己服务器返回数据实现自己的业务
        if (res.data.data.token) {
          wx.setStorageSync('token', res.data.data.token)
        }
      }
    },
    // 判断网络请求token过期的状态码，这个根据自己业务代码返回来判断,我这边的状态码为-220为过期，则会自动刷新token
    isTokenExpiredFn: (res) => {
      return res.code === -220
    }
  }
})
```

### demo

更多丰富示例可以查看demo，链接[quick-start](https://github.com/yydongwang/weReq-demo)。
