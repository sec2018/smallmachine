var utils = require('../../utils/utils.js');
const app = getApp();

// pages/monitor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipinfo: {},
    hadOnShow: false,
    getlastrecord: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;

    //获得设备信息
    // wx.getSystemInfo({
    //   success (res) {
    //     console.log(res.windowHeight);
    //     that.setData({
    //       phoneHeight: res.windowHeight,
    //     })
    //   }
    // })
    // // 查看是否授权
    // if (app.globalData.userInfo === null) {
    //   that.setData({
    //     login: true
    //   });
    // } else {
    //   that.setData({
    //     login: false
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { //返回显示页面状态函数
    var that = this;
    if (that.data.hadOnShow) {
      return;
    }
    //错误处理
    // this.onLoad(); //再次加载，实现返回上一页页面刷新(需要初始化变量)
    //正确方法
    //只执行获取地址的方法，来进行局部刷新(不能初始化变量)
    // 查看是否授权
    // if (app.globalData.userInfo === null) {
    //   that.setData({
    //     login: true
    //   })
    // } else {
    //   that.setData({
    //     login: false
    //   });
    // }
    that.getLastRecord();
    that.setData({
      getlastrecord:setInterval(function(){
        that.getLastRecord();
      },30000)
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    let getlastrecord = that.data.getlastrecord;
    clearInterval(getlastrecord);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLastRecord:function(){
    var that = this;
    utils.serverRequest({
      url: '/monitor/equipinfo/lastrecord',
      methods:'GET',
      success:function(res){
        console.log(res);
        if(res.data.code == 200){
          that.setData({
            equipinfo: res.data.data
          })
        }else{

        }
      },
      fail:function(res){
        if(res.data.code == 501 && res.data.msg == "token is unvalid"){
          wx.showToast({
            title: "token已过期，请重新登录！",
            duration: 3000
          });
          wx.reLaunch({
            url: "/pages/login/login"
        });
        }
      }
    })
  }
})