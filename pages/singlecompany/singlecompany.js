// pages/singlecompany/singlecompany.js
var utils = require('../../utils/utils.js');
const app = getApp();
let imgurl = app.globalData.imgurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company:{},
    id:null,
    company_num:null,
    username:null,
    imgurl: imgurl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.num != null && options.username == null){
      that.setData({
        company_num: options.num
      })
    let dataParam = {};
    dataParam.company_num = options.num;
    utils.pythonRequest({
      url: '/getComEqu/',
      data: dataParam,
      methods:'POST',
      success:function(res){
          console.log(res);
          if(res.data.code == 200){
            that.setData({
              company: res.data.data.company.fields, //请求结果数据
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
    }else{
      that.setData({
        username: options.username
      })

    }
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
  XjAction: function (e) { 
    wx.navigateTo({
      url: '../xjdetail/xjdetail'
    })
  },
})