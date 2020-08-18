// pages/xjplan/xjplan.js
const utils = require('../../utils/utils.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    equnum:'',
    equipname:'',
    xjplans:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.equnum != null && options.equipname!=null){
      that.setData({
        equnum: options.equnum,
        equipname: options.equipname
      })
      let dataParam = {};
      dataParam.equ_num = options.equnum;
      utils.pythonRequest({
        url: '/queryChkPlanList/',
        data: dataParam,
        methods:'GET',
        success:function(res){
            if(res.data.code == 200){
              that.setData({
                xjplans: res.data.data, //请求结果数据
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

  }
})