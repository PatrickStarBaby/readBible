// pages/groupSubpackage/searchGroup/searchGroup.js
//获取应用实例
const app = getApp()

Page({
  data: {
    inputVal: '',
    groupInfo:{},
    showResult: false
  },

  onLoad: function (options) {
    //时间戳
    var timestamp = new Date().getTime();
    console.log(timestamp)
  },

  //得到输入框内容
  getInputVal(e){
    // console.log(e.detail.value)
    this.setData({
      "inputVal": e.detail.value
    })
    if (e.detail.value.length == 0){
      this.setData({
        "showResult": false
      })
    }
  },

  // 搜索小组  按小组id搜索
  search() {
    wx.showLoading({
      title: '查询中',
    })
    var that = this;

    if(that.data.inputVal.length == 0){
      wx.showToast({
        title: '请输入小组id',
        icon: "none"
      })
      return 
    }

    wx.cloud.callFunction({
      name: "searchGroup",
      data: {
        key: that.data.inputVal
      },
      success(res) {
        wx.hideLoading();
        console.log("请求到的数据为",res.result.data)
        if (res.result.data[0] == undefined){
          that.setData({
            "groupInfo": {},
            "showResult": true
          })
        }else{
          that.setData({
            "groupInfo": res.result.data[0],
            "showResult": true
          })
        }
        
        console.log("data内容为",that.data.groupInfo)

      },
      fail(res) {
        wx.showToast({
          icon: "none",
          title: '网络异常，请重新搜索'
        })
        console.log(res)
      }
    })
  },

  // 删除输入框的内容
  clear(){
    this.setData({
      "inputVal": '',
      "showResult": false
    })
  },

  // 加入小组
  joinGroup(){
    wx.showLoading({
      title: '加入中',
    })
    let groupId =  this.data.groupInfo._id;
    let member = this.data.groupInfo.member;
    //判断全局变量中是否有openid信息
    if (app.globalData.openid){
      for( let i in member){
        if (member[i] == app.globalData.openid){
          wx.hideLoading()
          wx.showToast({
            title: '你已经加入该小组了，请勿重复操作',
            icon: "none"
          })
          return
        }else{
          wx.cloud.callFunction({
            name:'joinGroup',
            data:{
              groupId: groupId,
              member: member
            },
            success(res){
              wx.hideLoading()
              if (res.result.data == 1){
                wx.showToast({
                  title: '加入小组成功',
                  icon: 'success'
                })
              }
              console.log("加入小组成功", res.result.data)
            },
            fail(res){
              wx.hideLoading()
              console.log("加入小组失败", res)
            }
          })
        }
      }
    }else{
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          for (let i in member) {
            if (member[i] == app.globalData.openid) {
              wx.hideLoading()
              wx.showToast({
                title: '你已经加入该小组了，请勿重复操作',
                icon: "none"
              })
              return
            } else {
              wx.cloud.callFunction({
                name: 'joinGroup',
                data: {
                  groupId: groupId,
                  member: member
                },
                success(res) {
                  wx.hideLoading()
                  if (res.result.data == 1) {
                    wx.showToast({
                      title: '加入小组成功',
                      icon: 'success'
                    })
                  }
                  console.log("加入小组成功", res)
                },
                fail(res) {
                  wx.hideLoading()
                  console.log("加入小组失败", res)
                }
              })
            }
          }
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
  },
})