// 引入时间工具函数
const date = require("../../../utils/util.js").formatTime(new Date(), 1)
//获取应用实例
const app = getApp()

Page({

  data: {
    swiperList: [], //轮播图列表
    date: '', //当前时间
    num: 0, //打卡读的章数
    alreadyPunched: false, //今日是否已打卡
  },

  onLoad: function (options) {
    var that = this;
    //获取时间
    that.setData({
      "date": date
    })
    //从数据库中获取轮播图图片
    wx.cloud.callFunction({
      name: "getSwiperList",
      success(res){
        console.log(res.result.data)
        that.setData({
          "swiperList": res.result.data
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },

  // 开始章节
  start(){
    wx.navigateTo({
      url: '../../bibleSubpackage/section/section?sign=' + 0,
    })
  },

  // 结束章节
  end() {
    wx.navigateTo({
      url: '../../bibleSubpackage/section/section?sign=' + 1,
    })
  },

  // 打卡
  punch(){
    if (app.globalData.userInfo == null){
      wx.getUserInfo({
        success(res) {
          const userInfo = res.userInfo  //整体user对象
          const nickName = userInfo.nickName  //用户昵称
          const avatarUrl = userInfo.avatarUrl   //用户头像
          const gender = userInfo.gender // 性别 0：未知、1：男、2：女
          const province = userInfo.province  //用户国家  
          const city = userInfo.city       //用户所在城市
          const country = userInfo.country

          app.globalData.userInfo = userInfo
          wx.setStorage({
            key: 'userInfo',
            data: userInfo
          })
          // console.log(1)
          // wx.getStorage({
          //   key: 'userInfo',
          //   success: function(res) {
          //     console.log(res)
          //   },
          // })
        }
      })
    }
    
  },
  //历史记录
  toHistory(){

  },
})