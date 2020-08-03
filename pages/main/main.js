// pages/main/main.js
var utils = require('../../utils/utils.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    companys: [], // 公司列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    utils.serverRequest({
      url: '/check/company/list',
      methods:'GET',
      success:function(res){
          console.log(res);
          if(res.data.code == 200){
            that.setData({
              companys: res.data.data, //请求结果数据
            })
          }else{
              // 登录
              return;
          }
      },
      fail:function(res){
          // 登录
          return;
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  companyDetailAction: function (e) { 
    let id = parseInt(e.currentTarget.dataset.item.id);
    wx.navigateTo({
      url: '../singlecompany/singlecompany?id='+id,
    })
  },
})