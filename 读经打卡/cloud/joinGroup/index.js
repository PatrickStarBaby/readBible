// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xgy-aemob'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
    
  return  cloud.database().collection('group').doc(event.groupId).update({
    // data 传入需要局部更新的数据
    data: {
      member: event.member
    },
    success: function (res) {
      return res
    },
    fail(res){
      return res
    }
  })
}