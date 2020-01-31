//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'xgy-aemob'
    })
    
  },
  globalData: {
    userInfo: null
  }
})