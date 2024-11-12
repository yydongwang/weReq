class Loading {
  show(txt: boolean | string) {
    wx.showToast({
      title: typeof txt === 'boolean' ? '加载中' : txt,
      icon: 'loading',
      mask: true,
      duration: 60000
    })
  }

  hide() {
    wx.hideToast()
  }
}
export default Loading
