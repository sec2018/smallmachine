let amapFile = require('./amap-wx.js')
let myAmapFun = new amapFile.AMapWX({ key: 'c62c06a6cf26aba4906642f2c847c795' })
// 打开微信内置地图
function openLocation(params) {
  console.log(Number(params.longitude), params.longitude)
  wx.openLocation({
    latitude: Number(params.latitude),
    longitude: Number(params.longitude),
    address: params.address,
    scale: 18,
    success(res) {
      console.log(res)
    },
    fail(res) {
      console.log(res)
    }
  })
}
// 获取定位
function getLocation(cb) {
  wx.getSetting({
    success(setRes) {
      // 判断是否已授权
      console.log(setRes)
      if (!setRes.authSetting['scope.userLocation']) {
        wx.showModal({
          title: '提示',
          content: '需要获取您的位置，请打开设置，允许获取地理位置',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success(ores) {
                  console.log(ores)
                }
              })
            } else {
              let arr = [{
                latitude: '',
                longitude: '',
                regeocodeData: {
                  formatted_address: '定位失败'
                }
              }]
              cb && cb(arr)
            }
          }
        })
      } else {
        myAmapFun.getRegeo({
          success: function (data) {
            cb && cb(data)
          },
          fail: function (info) {
            // 失败回调
            console.log(info)
          }
        })
      }
    }
  })
}
module.exports = {
  openLocation,
  getLocation
}
