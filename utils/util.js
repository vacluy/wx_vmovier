const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function watch(key, callback) {
  // 先执行一次watch
  callback.call(this, this.data[key])
  let that = this
  let tmpData = this.data[key]
  Object.defineProperty(this.data, key, {
    set: function (value) {
      tmpData = value
      // 值变化了再执行一次
      callback.call(that, value)
    },
    get: function () {
      return tmpData
    }
  })
}
module.exports = {
  formatTime,
  watch
}