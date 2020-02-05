const formatTime = (date, type) => {  //根据type返回需要的时间格式 0带时分， 1带星期， 2什么都不带
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const week = date.getDay();
  const second = date.getSeconds()

  if(type == 0){
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  if(type == 1){
    return [year, month, day].map(formatNumber).join('/') + '(' + weekFun(week) + ')'
  }
  if (type == 2) {
    return [year, month, day].map(formatNumber).join('/')
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//根据星期返回正确的星期格式
function weekFun(n) {
  var weekday = new Array(7)
  weekday[0] = "星期天"
  weekday[1] = "星期一"
  weekday[2] = "星期二"
  weekday[3] = "星期三"
  weekday[4] = "星期四"
  weekday[5] = "星期五"
  weekday[6] = "星期六"

  return weekday[n];
}


module.exports = {
  formatTime: formatTime
}
