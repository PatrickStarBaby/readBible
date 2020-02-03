//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'xgy-aemob'//这个是环境ID，在云开发控制台可查看
    })
  },

  globalData: {
    userInfo: null
  }
})