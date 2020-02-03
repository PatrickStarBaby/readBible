// pages/bibleSubpackage/section/section.js

//获取应用实例
const app = getApp()

Page({

  data: {
    bible: []
  },

  onLoad: function(options) {
    console.log(options.sign)
    console.log(app.globalData.bible)
  },


  getUserInfo() {
    wx.getUserInfo({
      success(res) {
        const userInfo = res.userInfo  //整体user对象
        const nickName = userInfo.nickName  //用户昵称
        const avatarUrl = userInfo.avatarUrl   //用户头像
        const gender = userInfo.gender // 性别 0：未知、1：男、2：女
        const province = userInfo.province  //用户国家  
        const city = userInfo.city       //用户所在城市
        const country = userInfo.country

        console.log(userInfo)
      }
    })
    
  }

})