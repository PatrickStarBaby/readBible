//app.js
const bible = require("/static/bible.js")
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'xgy-aemob'//这个是环境ID，在云开发控制台可查看
    })
  },

  globalData: {
    userInfo: null,
    openid:'',
    bible: bible
  }
})