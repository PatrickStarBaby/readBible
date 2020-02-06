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
    // alreadyPunched: 1, //记录打卡次数
    startSec: "", //开始章节
    endSec: "", //结束章节

    punchSec: [], //打卡章节
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
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        // console.log(value)
        app.globalData.userInfo = value
      }
    } catch (e) {
      console.log(e)
    }
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
        let startName = app.globalData.startSec.split(app.globalData.startSec.replace(/[^0-9]+/ig, ""))[0]
        let startSec = parseInt(app.globalData.startSec.replace(/[^0-9]+/ig, ""))

        let endName = app.globalData.endSec.split(app.globalData.endSec.replace(/[^0-9]+/ig, ""))[0];
        let endSec = parseInt(app.globalData.endSec.replace(/[^0-9]+/ig, ""))
          
        // 开始章节与结束章节是同一章
        if (startName == endName){
          wx.showLoading({
            title: '加载中',
          })
          console.log('[' + startName + startSec + '-' + endSec + '章]')
          let punchSec = '[' + startName + startSec + '-' + endSec + '章]';
          if (startSec == endSec){
            punchSec = '[' + startName + startSec + '章]';
          }
          let punchSum = endSec - startSec + 1
          this.confirmPunch(punchSec, punchSum)
          wx.hideLoading();
          
        }else{//开始章节与结束章节不是同一章
          let oldTestament = app.globalData.bible.slice(0, 39)
          let newTestament = app.globalData.bible.slice(39, 66)
          let punchSec = [];
          let punchSum = 0;
          for (let item of oldTestament){
            if (item.name == startName){
              let sec = '[' + startName + startSec + '-' + item.section + "章]";
              if (startSec == item.section){
                sec = '[' + startName + startSec + "章]";
              }
              punchSum += (item.section - startSec + 1)
              punchSec.push(sec)
            }
            if (item.name == endName){
              let sec = '[' + endName + '1' + '-' + endSec + '章]';
              punchSum += endSec
              punchSec.push(sec)             
            }
          }
          for (let item of newTestament) {
            if (item.name == startName) {
              let sec = '[' + startName + startSec + '-' + item.section + "章]";
              if (startSec == item.section) {
                sec = '[' + startName + startSec + "章]";
              }
              punchSum += (item.section - startSec + 1)
              punchSec.push(sec)              
            }
            if (item.name == endName) {
              let sec = '[' + endName + '1' + '-' + endSec + '章]';
              punchSum += endSec
              punchSec.push(sec)
            }
          }
          this.confirmPunch(punchSec, punchSum)
        }

      }else{
        wx.showToast({
          title: '请选择完整的打卡章节',
          icon: "none"
        })
      }
    }

  },
  //提取出来的公共方法（储存打卡信息）
  saveSectionInfo(punchSec, punchSum){
    console.log("punchSum",punchSum)
    app.globalData.punchSec.push(punchSec)
    wx.setStorage({
      key: 'punchSec',
      data: app.globalData.punchSec,
    })
    this.setData({
      punchSec: app.globalData.punchSec
    }) 
  },
  //提取出来的公共方法（确定打卡）
  confirmPunch(punchSec, punchSum) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '打卡章节为：' + punchSec + '，打卡后记录不可修改，确定打卡吗？',
      cancelText: '重新选择',
      confirmText: '确定打卡',
      success(res) {
        if (res.confirm) {
          that.saveSectionInfo(punchSec, punchSum)
          wx.showToast({
            title: '打卡成功',
            icon: "success"
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  //历史记录
  toHistory() {

  },
})