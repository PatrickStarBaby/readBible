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

    try {
      var value = wx.getStorageSync('groupInfo')
      if (value) {
        // console.log(value)
        this.setData({
          groupInfo: value
        })
      }
    } catch (e) {
      console.log(e)
    }
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
  joinGroup(e){
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        // console.log(value)
        app.globalData.userInfo = value
      }
    } catch (e) {
      console.log(e)
    }
    // 检查是否登录
    if (app.globalData.userInfo == null && e.detail.rawData != undefined) {
      let userInfo = JSON.parse(e.detail.rawData) //整体user对象
      wx.cloud.callFunction({
        name: "login",
        data: {
          userInfo: userInfo
        },
        success(res) {
          console.log("获取openid成功", res.result.openid)
          // console.log("message", res.result)
          userInfo.openid = res.result.openid
          app.globalData.userInfo = userInfo
          wx.setStorage({
            key: 'userInfo',
            data: userInfo
          })
          console.log(app.globalData.userInfo)
          that.register();
          wx.hideLoading();
        },
        fail(res) {
          console.log("获取openid失败", res)
        }
      })
    }else{//如果登陆了就可以加入小组
      let groupId = this.data.groupInfo._id;
      let member = this.data.groupInfo.member;
      for (let i in member) {
        if (member[i] == app.globalData.userInfo.openid) {
          wx.hideLoading()
          wx.showToast({
            title: '你已经加入该小组了，请勿重复操作',
            icon: "none"
          })
          return
        }
      }
      console.log(this.data.groupInfo._id + "--" + this.data.groupInfo.member)
      this.data.groupInfo.member.push(app.globalData.userInfo.openid)
      wx.cloud.callFunction({
        name: 'joinGroup',
        data: {
          groupId: this.data.groupInfo._id,
          member: this.data.groupInfo.member
        },
        success(res) {
          wx.hideLoading()
          console.log("加入小组成功", that.data.groupInfo.member)
          wx.setStorage({
            key: 'groupInfo',
            data: that.data.groupInfo
          })
          wx.showModal({
            title: '提示',
            content: '加入小组成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.onLoad()
              }
            }
          })
        },
        fail(res) {
          wx.hideLoading()
          console.log("加入小组失败", res)
        }
      })
    }
    
  },
  //注册
  register() {
    let nickName = app.globalData.userInfo.nickName
    let avatarUrl = app.globalData.userInfo.avatarUrl
    let gender = app.globalData.userInfo.gender

    //检测是否是新用户
    wx.cloud.database().collection("userList").where({
      uid: 'app.globalData.userInfo.openid'
    }).get({
      success(res) {
        // isNew = false
        console.log(res)
        if (res.data.length == 0) {
          console.log("新用户注册")
          //是新用户就把用户信息添加到用户表
          wx.cloud.database().collection("userList").add({
            data: {
              nickName: nickName,
              avatarUrl: avatarUrl,
              gender: gender,
              punchInfo: [],
              uid: app.globalData.userInfo.openid
            },
            success(res) {
              console.log(res)
              wx.setStorage({
                key: '_id',
                data: res._id
              })
            },
          })
        }
      }
    })

  },
})