// 引入时间工具函数
const date = require("../../../utils/util.js").formatTime(new Date(), 1)

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

  //历史记录
  toHistory(){

  },
})