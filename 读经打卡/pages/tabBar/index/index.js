// 引入时间工具函数 传入参数不一样结果也不一样 
const date = require("../../../utils/util.js").formatTime(new Date(), 1)
const punchDate = require("../../../utils/util.js").formatTime(new Date(), 2)
//获取应用实例
const app = getApp()

Page({

  data: {
    swiperList: [], //轮播图列表
    date: '', //当前时间
    num: 0, //打卡读的章数
    alreadyPunched: false, //今日是否已打卡
    startSec: "", //开始章节
    endSec: "", //结束章节

    punchSec: "", //打卡章节
  },
  onShow: function (e) {//调用onLoad刷新页面数据
    this.onLoad();
  },
  onLoad: function(options) {
    var that = this;
    //获取时间
    that.setData({
      "date": date
    })
    //从数据库中获取轮播图图片
    wx.cloud.callFunction({
      name: "getSwiperList",
      success(res) {
        // console.log(res.result.data)
        that.setData({
          "swiperList": res.result.data
        })
      },
      fail(res) {
        console.log(res)
      }
    })

    //从全局变量中获取打卡的章节信息
    that.setData({
      startSec: app.globalData.startSec,
      endSec: app.globalData.endSec,
      punchSec: app.globalData.punchSec
    })

    
  },

  // 开始章节
  start() {
    wx.navigateTo({
      url: '../../bibleSubpackage/section/section?sign=' + 0,
    })
  },

  // 结束章节
  end() {
    if (this.data.startSec.length == 0) {
      wx.showToast({
        title: '请先选择开始章节',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '../../bibleSubpackage/section/section?sign=' + 1,
    })
  },

  // 打卡
  // const nickName = userInfo.nickName  //用户昵称
  // const avatarUrl = userInfo.avatarUrl   //用户头像
  // const gender = userInfo.gender // 性别 0：未知、1：男、2：女
  // const province = userInfo.province  //用户国家  
  // const city = userInfo.city       //用户所在城市
  // const country = userInfo.country
  punch(e) {
    // console.log(e.detail.rawData)
    if (app.globalData.userInfo == null && e.detail.rawData != undefined) {
      let userInfo = JSON.parse(e.detail.rawData) //整体user对象
      wx.cloud.callFunction({
        name: "login",
        success(res) {
          console.log("获取openid成功", res.result.openid)
          userInfo.openid = res.result.openid
          app.globalData.userInfo = userInfo
          wx.setStorage({
            key: 'userInfo',
            data: userInfo
          })
          console.log(app.globalData.userInfo)
        },
        fail(res) {
          console.log("获取openid失败", res)
        }
      })
    }else{
      if (app.globalData.startSec.length != 0 && app.globalData.endSec.length != 0){
        //从全局变量得到章节信息并分离出书卷名跟章节数
        // console.log(app.globalData.startSec.replace(/[^0-9]+/ig, ""))
        // console.log(app.globalData.startSec.split(app.globalData.startSec.replace(/[^0-9]+/ig, ""))[0])

        let startName = app.globalData.startSec.split(app.globalData.startSec.replace(/[^0-9]+/ig, ""))[0]
        let startSec = app.globalData.startSec.replace(/[^0-9]+/ig, "")

        let endName = app.globalData.endSec.split(app.globalData.endSec.replace(/[^0-9]+/ig, ""))[0];
        let endSec = app.globalData.endSec.replace(/[^0-9]+/ig, "")

        if (startName == endName){
          console.log(punchDate + ' [' + startName + startSec + '-' + endSec + '章]')
          let punchSec = punchDate + ' [' + startName + startSec + '-' + endSec + '章]';
          this.setData({
            punchSec: punchSec
          })
          wx.setStorage({
            key: 'punchSec',
            data: punchSec,
          })
          app.globalData.punchSec = punchSec
        }
      }else{
        wx.showToast({
          title: '请选择完整的打卡章节',
          icon: "none"
        })
      }
    }

  },
  //历史记录
  toHistory() {

  },
})