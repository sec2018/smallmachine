// pages/user/user.js
const app = getApp()
let userInfo = app.globalData.userInfo;
var utils = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeout:[
      {text:"不开启"},
      {text:"播放当前声音关闭"},
      {text:"播放2首声音关闭"},
      {text:"播放3首声音关闭"},
      {text:"播放4首声音关闭"},
      {text:"10分钟后"},
      {text:"20分钟后"},
      {text:"30分钟后"},
    ],
    activeIndex:0,
  },

  onLoad: function (options) {
    var that = this;
    //获得设备信息
    wx.getSystemInfo({
      success (res) {
        console.log(res.windowHeight);
        that.setData({
          phoneHeight: res.windowHeight,
        })
      }
    })
    // 查看是否授权
    if (app.globalData.userInfo === null) {
      that.setData({
        login: true
      })
    } else {
      that.setData({
        login: false,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      })
    }
  },
  onShow() { //返回显示页面状态函数
    var that = this;
    //错误处理
    // that.onLoad(); //再次加载，实现返回上一页页面刷新(需要初始化变量)
    //正确方法
    //只执行获取地址的方法，来进行局部刷新(不能初始化变量)
    // 查看是否授权
    if (app.globalData.userInfo === null) {
      that.setData({
        login: true
      })
    } else {
      that.setData({
        login: false,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      })
    }
  },
  // 获取用户的头像和昵称信息
  bindGetUserInfo(e) {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(e.detail.userInfo);
        // app.globalData.userInfo = e.detail.userInfo;
        that.setData({
          login: false,
          // avatarUrl: e.detail.userInfo.avatarUrl,
          // nickName: e.detail.userInfo.nickName
        });

        let userinfoparam = {};
        let sessionKey = wx.getStorageSync('sessionKey');
        if(sessionKey == null || sessionKey == ""){
          app.mylogin();
          sessionKey = wx.getStorageSync('sessionKey');
        }
        userinfoparam.sessionKey = sessionKey;
        // userinfoparam.signature = res.signature;
        // userinfoparam.rawData = res.rawData;
        userinfoparam.encryptedData = res.encryptedData;
        userinfoparam.iv = res.iv;
        // userinfoparam.username = app.globalData.userInfo.username;
        let userInfo = JSON.parse(wx.getStorageSync("userInfo"));
        userinfoparam.username = userInfo.username;
        console.log(userinfoparam);
        wx.showLoading({
          title: '绑定中...',
          mask: true,
        })
        // utils.serverRequest({
        //   url: '/wx/user/'+app.globalData.appid+'/info',
        utils.pythonRequest({
          url: '/weChatGetInfo/',
          methods:'GET',
          data: userinfoparam,
          success:function(res){
            if(res.data.code == 200){
              wx.showToast({
                mask: true,
                icon: "none",
                title: "绑定成功"
              });
              app.globalData.userInfo = res.data.data;
              that.setData({
                login: false
              });
            }else{
              wx.showToast({
                mask: true,
                icon: "none",
                title: "绑定异常，请重新绑定"
              });
            }
          },
          fail:function(res){
            wx.showToast({
              mask: true,
              icon: "none",
              title: "绑定失败"
            });
          }
        });
      }
    })
  },
  phoneLogin:function(){
    wx.navigateTo({
      url: './phoneLogin/phoneLogin',
    });
  },
  gotoLogin(){
    wx.navigateTo({
      url: './phoneLogin/phoneLogin',
    });
  },
  openSwitch:function(){
    var that = this;
    that.setData({
      show:true
    })
  },
  close:function(){
    var that = this;
    that.setData({
      show:false
    })
  },
  chooseTimeOut:function(e){
    var that = this;
    console.log(e)
    that.setData({
      activeIndex:e.currentTarget.dataset.activeindex
    })
  }

})