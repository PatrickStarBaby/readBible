//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database().collection("counters")
Page({
  data: {
    name: '',
    age: '',
    id: '',
    newAge: '',
    imgSrc: '',
    vedioSrc: ''
  },
  // -------------------数据库操作函数--------------------
  inputName(e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  inputAge(e) {
    console.log(e.detail.value)
    this.setData({
      age: e.detail.value
    })
  },
  //添加数据
  addData() {
    db.add({
      data: {
        name: this.data.name,
        age: this.data.age
      },
      success(res) {
        console.log("添加成功" + JSON.stringify(res));
      }
    })
  },
  //查询数据
  getData() {
    db.get({
      success(res) {
        console.log("查找成功", res)
      }
    })
  },
  inputId(e) {
    this.setData({
      id: e.detail.value
    })
  },
  //删除数据
  delData() {
    db.doc(this.data.id).remove({
      success(res) {
        console.log("删除数据成功", res)
      },
      fail(res) {
        console.log("删除数据失败", res)
      }
    })
  },

  inputNewAge(e) {
    this.setData({
      newAge: e.detail.value
    })
  },
  //更新数据
  updData() {
    var that = this
    db.doc(this.data.id).update({
      data: {
        age: that.data.newAge
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },


  // ---------------------云函数----------------------
  // 云函数实现加法
  yunAdd() {
    wx.cloud.callFunction({
      name: "add",
      data: {
        a: 1,
        b: 5
      },
      success(res) {
        console.log("云函数请求成功", res)
      },
      fail(res) {
        console.log("云函数请求失败", res)
      }
    })
  },
  //云函数获取数据库数据
  yunGetData() {
    wx.cloud.callFunction({
      name: "getData",
      success(res) {
        console.log("云函数获取数据库数据成功", res.result.data)
      }
    })
  },


  // ---------------------云存储----------------------
  // 上传图片
  uploadImg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.png', // 上传至云端的路径
          filePath: tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            that.setData({
              "imgSrc": res.fileID
            })
          },
          fail: console.error
        })
      }
    })
  },

  //上传视频文件
  uploadVideo() {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log("选择视频成功", res.tempFilePath)
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.mp4', // 上传至云端的路径
          filePath: res.tempFilePath, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log("上传视频成功", res.fileID)
            that.setData({
              "vedioSrc": res.fileID
            })
          },
          fail: console.error
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  // 上传excel文件
  uploadExcel() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.xlsx', // 上传至云端的路径
          filePath: tempFilePaths[0].path, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log("上传excel文件成功", res.fileID)
            // that.setData({
            //   "vedioSrc": res.fileID
            // })
          },
          fail: console.error
        })
      }
    })
  },

  // 下载并打开excel文件
  downloadExcel() {
    wx.cloud.downloadFile({
      fileID: 'cloud://xgy-aemob.7867-xgy-aemob-1300217300/1580521904918.xlsx', // 文件 ID
      success: res => {
        // 返回临时文件路径
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function(res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: console.error
    })
  },

  onLoad: function() {

  },

})