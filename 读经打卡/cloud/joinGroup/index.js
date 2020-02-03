// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xgy-aemob'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let sign = 0
  // event.groupId event.member
  let member = event.member.push(wxContext.OPENID)
  cloud.database().collection('group').doc(event.groupId).update({
    // data 传入需要局部更新的数据
    data: {
      // 表示将 done 字段置为 true
      member: member
    },
    success: function (res) {
      console.log(res.data)
      sign = 1;
    }
  })
  return sign
}