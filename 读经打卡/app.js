//app.js
const bible = require("/static/bible.js")
const punchDate = require("/utils/util.js").formatTime(new Date(), 2)

App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'xgy-aemob'//这个是环境ID，在云开发控制台可查看
    })

  },

  globalData: {
    userInfo: null,
    bible: bible.bible,
    // startSec: {//开始章节信息
    //   isOldTestament:false, //是否是旧约
    //   name: '', //书卷名
    //   section: '' //章节数
    // }, 
    // endSec: {//结束章节信息
    //   isOldTestament: false, //是否是旧约
    //   name: '', //书卷名
    //   section: '' //章节数
    // },
    startSec: '',
    endSec:'',

    punchSec: [], //已经选择打卡的章节
    punchSum: 0, //打卡的章数
  }
})