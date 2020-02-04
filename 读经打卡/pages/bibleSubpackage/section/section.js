// pages/bibleSubpackage/section/section.js

//获取应用实例
const app = getApp()

Page({

  data: {
    sign: 0, //开始、结束的标志位 0开始/1结束
    bible: [],
    newTestament: [], //新约
    oldTestament: [], //旧约
    isSelect: true, //控制卷、章切换
    startSecInfo:{}, //选择的开始章节信息
    name: '', //点击的书卷名
    section: 0, //点击书卷的章数

    beginIndex: -1, //打卡的开始章节
    endIndex: -1, //打卡的结束章节
  },

  onLoad: function(options) {
    this.setData({
      sign: options.sign
    })
    // console.log(options.sign)
    // console.log(app.globalData.bible)
    let oldTestament = app.globalData.bible.slice(0, 39)
    let newTestament = app.globalData.bible.slice(39, 66)
    this.setData({
      "bible": app.globalData.bible,
      "newTestament": newTestament,
      "oldTestament": oldTestament
    })
  },

  // 卷、章切换
  selectJ() {
    this.setData({
      isSelect: true
    })
  },
  selectZ() {
    this.setData({
      isSelect: false
    })
  },

  // 选择卷
  toSection(e) {
    var that = this;
    let index = e.currentTarget.dataset.index

    //this.data.sign区分开始章节与结束章节
    if (this.data.sign == 0) {//开始章节
      // 标志位为0是旧约
      if (e.currentTarget.dataset.sign == 0) {
        let section = this.data.oldTestament[index].section
        let name = this.data.oldTestament[index].name
        this.setData({
          isSelect: false,
          section: section,
          name: name
        })
        let startSecInfo = {}; //开始章节的信息
        startSecInfo.isOldTestament = 1 //选择的旧约
        startSecInfo.start = index //选择的开始书卷
        startSecInfo.name = name //选择的开始书卷名
        wx.setStorage({ //将选择的开始章节信息存入缓存
          key: 'startSecInfo',
          data: startSecInfo
        })
      } else { //标志位为1是新约
        let section = this.data.newTestament[index].section
        let name = this.data.newTestament[index].name
        this.setData({
          isSelect: false,
          section: section,
          name: name
        })
        let startSecInfo = {}; //开始章节的信息
        startSecInfo.isOldTestament = 0 //选择的新约
        startSecInfo.start = index //选择的开始书卷
        startSecInfo.name = name //选择的开始书卷名
        wx.setStorage({ //将选择的开始章节信息存入缓存
          key: 'startSecInfo',
          data: startSecInfo
        })
      }
    }

    // 如果是选择结束章节时不能选择开始章节以前的
    if (this.data.sign == 1) {//结束章节
      console.log(index)
      console.log(e.currentTarget.dataset.sign)
      try {
        var value = wx.getStorageSync('startSecInfo')
        if (value) {
          console.log(value)
          that.setData({
            startSecInfo: value
          })
        }
      } catch (e) {
        console.log(e)
      }

      let startSecInfo = that.data.startSecInfo
      // -------------判断结束章节是否小于开始章节-----------
      // 如果开始章节选择的新约，结束章节就不能选择旧约
      if (startSecInfo.isOldTestament == 0 && e.currentTarget.dataset.sign == 0) {
        wx.showToast({
          title: '结束章节不能小于开始章节',
          icon: "none"
        })
        return
      }
      //如果开始章节和结束章节选择的都是旧约或者新约，结束章节不能小于开始章节
      if (startSecInfo.isOldTestament == 1 && e.currentTarget.dataset.sign == 0 || startSecInfo.isOldTestament == 0 && e.currentTarget.dataset.sign == 1){
        console.log("hh")
        if (index < startSecInfo.start){
          wx.showToast({
            title: '结束章节不能小于开始章节',
            icon: "none"
          })
          return
        }
      }
    }
  },

  // 选择章
  selectSection(e) {
    console.log(e.currentTarget.dataset.index)
    // 选择开始章节
    if (this.data.sign == 0) {
      this.setData({
        beginIndex: e.currentTarget.dataset.index
      })
    } else { // 选择结束章节
      this.setData({
        endIndex: e.currentTarget.dataset.index
      })
    }

  },

  // 确定选择
  confirm() {
    if (this.data.sign == 0) {
      console.log(this.data.name + (this.data.beginIndex + 1) + "章")
    } else {
      console.log(this.data.name + this.data.endIndex)
    }
  },
})