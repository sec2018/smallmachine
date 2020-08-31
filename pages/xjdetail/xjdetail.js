// pages/xjdetail/xjdetail.js
const utils = require('../../utils/utils.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    equid:null,
    chkplanlist:[],
    firstchkplan:{},
    submitdata:{},
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
    chkIndex: -1,
    chkAddItemIndex: 0,
    chkItemIndex:0,
    chkAddItemItemIndex:0,
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
        methods:'GET',
        success:function(res){
            if(res.data.code == 200){
              that.setData({
                equipment: res.data.data, //请求结果数据
              })

              let equipParam = {};
              equipParam.equ_num = res.data.data.num;
              utils.pythonRequest({
                url: '/queryChkPlanInfoProceed/',
                data: equipParam,
                methods:'GET',
                success:function(chkplanres){
                    if(chkplanres.data.code == 200){
                      that.setData({
                        firstchkplan: chkplanres.data.data, //请求结果数据
                        [`submitdata.technician_id`]: app.globalData.userInfo.id,
                        [`submitdata.chk_plan_id`]: chkplanres.data.data.id,
                      })
                      console.log(this.data.firstchkplan);
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
    console.log(this.data.chkIndex)
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
  // 组件的回调事件
  handleSaveSuccess: function (e){
    console.log(e.detail);
    const result = e.detail;
    if(result.params.paramName === 'add_item'){ //其他项
      this.setData({
        [`firstchkplan.add_item[${result.params.paramIndex}]`]: result.data
      })
    } else {
      this.setData({
        [`firstchkplan.chk_routine.chk_class[${result.params.paramName}].item[${result.params.paramIndex}]`]: result.data
      })
    }
    
  },
  XjDetailAction: function (e) { 
    wx.navigateTo({
      url: '../xjorder/xjorder'
    })
  },
  XjPlans: function (e) { 
    let equ = this.data.equipment;
    wx.navigateTo({
      url: '../xjplan/xjplan?equnum='+equ.num+'&equipname='+equ.name
    })
  },
  handleShowDetail: function(e){
    let {index} = e.currentTarget.dataset;
    console.log(index, this.data.chkIndex)
    if(index == this.data.chkIndex){
      index = -1;
    }
    this.setData({
      chkIndex: index
    })
  },
 
  //提交到后台
  sureUpload:function(e){
    let that = this;
    wx.showModal({
      title: '提交巡检结果',
      content: '确定提交？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
            mask:true
          })
          let feedback_data = [];
          for(var i = 0; i < that.data.firstchkplan.add_item.length; i++){
            let item = {};
            item.id = that.data.firstchkplan.add_item[i].id;
            item.result = that.data.firstchkplan.add_item[i].result;
            item.pic_url = that.data.firstchkplan.add_item[i].pic_url;
            feedback_data.push(item);
          }
          for(var j = 0; j < that.data.firstchkplan.chk_routine.chk_class.length; j++){
            for(var k = 0; k < that.data.firstchkplan.chk_routine.chk_class[j].item.length; k++){
              let item = {};
              item.id = that.data.firstchkplan.chk_routine.chk_class[j].item[k].id;
              item.result = that.data.firstchkplan.chk_routine.chk_class[j].item[k].result;
              item.pic_url = that.data.firstchkplan.chk_routine.chk_class[j].item[k].pic_url;
              feedback_data.push(item);
            }
          }
          that.setData({
            [`submitdata.feedback_data`]: feedback_data,
          })
          utils.pythonRequest({
            url: '/postNewChkHistory/',
            data: that.data.submitdata,
            methods:'POST',
            success:function(res){
                console.log(res);
                if(res.data.code == 200){
                  wx.hideLoading();
                  wx.showToast({
                    title: '提交成功',
                    icon:"success",
                    duration:2000
                  })
                }else{
                  wx.hideLoading();
                  wx.showToast({
                    title: '提交失败',
                    icon:"failed",
                    duration:2000
                  })
                  return;
                }
            },
            fail:function(res){
              wx.hideLoading();
              return;
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }
})
