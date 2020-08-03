// pages/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: ''
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
  getScancode: function() {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        _this.setData({
          result: result,
        })
      }
    })
  },
  // 扫码入库
  datain: function(){
    wx.scanCode({
      success: function(res){
        // 跳转页面
        // wx.navigateTo({
        //   url: '../datain/datain?res='+res['result']
        // })
      },
      fail: function(res){
        var error = '入库扫码失败'
        // wx.navigateTo({
        //   url: '../error/error?error='+error,
        // })
      }
    })
  },


  // 扫码出库
  dataout: function(){
    wx.scanCode({
      success: function(res){
        var result = res['result']
        // wx.navigateTo({
        //   url: '../dataout/dataout?code='+result,
        // })
      },
      fail: function (res) {
        var error = '出库扫码失败'
        // wx.navigateTo({
        //   url: '../error/error?error=' + error,
        // })
      }
    })
    
  },

  // 查询条目
  query: function(){
    // wx.navigateTo({
    //   url: '../query/query',
    // })
  }
})