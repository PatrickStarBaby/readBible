//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    logged: false,
    authSetting: false //用户是否授权
  },

  //获取openid
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  getUserInfo(e){
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo:{
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo
        }
      })
    }
    console.log(e)
  },

  // app.globalData.userInfo
  onLoad(){
    var that = this;
    
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })


    wx.getUserInfo({
      success: function (res) {
        // that.setData({
        //   "userInfo": res.userInfo
        // })
        console.log(res.userInfo)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        that.onGetOpenid()
      }
    })
  },
})
