//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database().collection("counters")
Page({
  data: {
    name:'',
    age:'',
    id:'',
    newAge:''
  },
  // -------------------数据库操作函数--------------------
  inputName(e){
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  inputAge(e){
    console.log(e.detail.value)
    this.setData({
      age: e.detail.value
    })
  },
  //添加数据
  addData(){
    db.add({
      data:{
        name: this.data.name,
        age: this.data.age
      },
      success(res){
        console.log("添加成功"+ JSON.stringify(res));
      }
    })
  },
  //查询数据
  getData(){
    db.get({
      success(res){
        console.log("查找成功", res)
      }
    })
  },
  inputId(e){
    this.setData({
      id: e.detail.value
    })
  },
  //删除数据
  delData(){
    db.doc(this.data.id).remove({
      success(res){
        console.log("删除数据成功", res)
      },
      fail(res){
        console.log("删除数据失败", res)
      }
    })
  },

  inputNewAge(e){
    this.setData({
      newAge: e.detail.value
    })
  },
  //更新数据
  updData(){
    var that = this
    db.doc(this.data.id).update({
      data: {
        age: that.data.newAge
      },
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      }
    })
  },


  // ----------------云函数-----------------
  


  onLoad: function () {
    
  },
  
})
