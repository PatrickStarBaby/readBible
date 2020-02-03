// pages/groupSubpackage/searchGroup/searchGroup.js
Page({
  data: {
    inputVal: '',
    groupInfo:{}
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
        console.log(res.result.data)
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
      "inputVal": ''
    })
  },
})