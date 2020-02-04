// pages/bibleSubpackage/section/section.js

//获取应用实例
const app = getApp()

Page({

  data: {
    bible: [],
    newTestament: [], //新约
    oldTestament: [], //旧约
    isSelect: true, //控制卷、章切换
    name: '', //点击的书卷名
    section: 0, //点击书卷的章数
    
    beginSection:0, //打卡的开始章节
    endSection: 0, //打卡的结束章节
  },

  onLoad: function(options) {
    console.log(options.sign)
    console.log(app.globalData.bible)
    let oldTestament = app.globalData.bible.slice(0,39)
    let newTestament = app.globalData.bible.slice(39,66)
    this.setData({
      "bible": app.globalData.bible,
      "newTestament": newTestament,
      "oldTestament": oldTestament
    })
  },

  // 卷、章切换
  selectJ(){
    this.setData({
      isSelect: true
    })
  },
  selectZ() {
    this.setData({
      isSelect: false
    })
  },

  // 选择章节
  toSection(e){
    // 标志位为0是旧约
    if (e.currentTarget.dataset.sign == 0){
      let section = this.data.oldTestament[e.currentTarget.dataset.index].section
      let name = this.data.oldTestament[e.currentTarget.dataset.index].name 
      this.setData({
        isSelect: false,
        section: section,
        name: name
      })
      console.log(section + name)
    }else{
      let section = this.data.newTestament[e.currentTarget.dataset.index].section
      let name = this.data.newTestament[e.currentTarget.dataset.index].name
      this.setData({
        isSelect: false,
        section: section,
        name: name
      })
      console.log(section + name)
    }

    // console.log(this.data.section)
  },
})