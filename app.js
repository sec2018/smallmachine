var utils = require('utils/utils.js');
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    this.mylogin();
   
  },
  globalData: {
    userInfo: null,
    appid: 'wx26901b3877e768c4',
    imgurl: 'https://micro-service.online:8051/media/'
  },
  mylogin: function(){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let dataParam = {};
        dataParam.code = res.code;
        utils.serverRequest({
          url: '/wx/user/'+this.globalData.appid+'/wxlogin',
          methods:'GET',
          data: dataParam,
          success:function(res){
            // console.log(res.data.token);
            wx.setStorageSync('sessionKey', res.data.sessionKey);
            wx.showToast({
              title: res.data.sessionKey,
              icon:'none'
            });
          },
          fail:function(){
          }
        })
      }
    });
  },
  mysetting:function(){
     // 获取用户信息
     wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.checkSession({
            success: (res) => {
              // session_key未过期
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo;

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            },
            fail: (res) => {
              this.mylogin;
            }
          })
          
        }
      }
    })
  }
})