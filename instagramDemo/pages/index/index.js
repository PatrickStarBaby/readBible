//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  
  onLoad(){
    wx.cloud.callFunction({
      name: "getUserList",
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
  }
})
