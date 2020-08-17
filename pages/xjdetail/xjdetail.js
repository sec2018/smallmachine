// pages/xjdetail/xjdetail.js
const utils = require('../../utils/utils.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    equid:null,
    chkplanlist:[],
    firstchkplan:{},
    historyinfo:[
      {
        time: '2020/08/09 18:45',
        formname: '设备巡检单',
        xjpersonname: '张三',
        xjresult: '正常'
      }
    ],
    lasthistoryinfo:{
      time: '2020/08/09 18:45',
      formname: '设备巡检单',
      xjpersonname: '张三',
      xjresult: '正常'
    },
    chkpoint:[
      {
        content:'检查水泵运行声音是否正常检查水泵运行声音是否正常',
        method: '耳听耳听耳听耳听耳听耳听耳听'
      },
      {
        content:'配电柜电流，频率显示状态',
        method: '目视'
      },
      {
        content:'各连接螺栓是否正常',
        method: '目视，手摸'
      },
      {
        content:'泵体及连接管道是否有漏水现象',
        method: '目视'
      },
      {
        content:'检查压力表是都在正常范围',
        method: '目视'
      }
    ],
    equipment:{
      equname:'2#循环泵',
      type:'SLR150-152A',
      position:'换热站',
      keepperson:'张三',
      phonenum:'13256487562',
      startdate:'2019-12-03'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.id != null && !options.username){
      that.setData({
        equid: options.id
      })
      let dataParam = {};
      dataParam.equ_id = options.id;
      utils.pythonRequest({
        url: '/getEquInfo/',
        data: dataParam,
        methods:'POST',
        success:function(res){
            console.log(res);
            if(res.data.code == 200){
              that.setData({
                equipment: res.data.data, //请求结果数据
              })

              let chkplanlistParam = {};
              chkplanlistParam.equ_num = res.data.data.num;
              utils.pythonRequest({
                url: '/queryChkPlanList/',
                data: chkplanlistParam,
                methods:'POST',
                success:function(chkplanlistres){
                    if(chkplanlistres.data.code == 200){
                      that.setData({
                        chkplanlist: chkplanlistres.data.data, //请求结果数据
                      })

                      let chkplanParam = {};
                      chkplanParam.chk_plan_id = chkplanlistres.data.data[0];
                      utils.pythonRequest({
                        url: '/queryChkPlan/',
                        data: chkplanParam,
                        methods:'POST',
                        success:function(chkplanres){
                            if(chkplanres.data.code == 200){
                              that.setData({
                                firstchkplan: chkplanres.data.data, //请求结果数据
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

  },
  XjDetailAction: function (e) { 
    wx.navigateTo({
      url: '../xjorder/xjorder'
    })
  }
})