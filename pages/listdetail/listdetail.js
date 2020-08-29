// pages/listdetail/listdetail.js
const utils = require('../../utils/utils.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    planid:'',
    firstchkplan:{},
    chkIndex: 0,
    chkAddItemIndex: 0,
    chkItemIndex:0,
    chkAddItemItemIndex:0,
    submitdata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.id != null){
      that.setData({
        planid: options.id
      })
      let dataParam = {};
      dataParam.chk_plan_id = options.id;
      utils.pythonRequest({
        url: '/queryChkPlanInfo/',
        data: dataParam,
        methods:'GET',
        success:function(res){
            if(res.data.code == 200){
              that.setData({
                firstchkplan: res.data.data, //请求结果数据
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
  handleShowItemDetail:function(e){
    let {index} = e.currentTarget.dataset;
    this.setData({
      chkItemIndex: index
    })
    console.log("index:"+this.data.chkIndex, "itemindex:"+this.data.chkItemIndex)
  },
  handleShowAddItemDetail:function(e){
    let {index} = e.currentTarget.dataset;
    this.setData({
      chkAddItemIndex: index
    })
    console.log("additemindex:"+this.data.chkAddItemIndex)
  },
  // radio
  handleXjResult (e){
    let {type} = e.currentTarget.dataset;
    let {index} = e.currentTarget.dataset;
    this.setData({
      chkItemIndex: index
    })
    this.setData({
      [`firstchkplan.chk_routine.chk_class[${this.data.chkIndex}].item[${this.data.chkItemIndex}].result`]: type
    })
  },


  //选择图片
  chooseImg: function (e) {
    const that = this;
    const limitMsg = () => wx.showToast({ title: '最多只能上传1张图片', icon: 'none' })
    let imgs = this.data.imgs;
    if (imgs.length >= 1) {
      limitMsg()
      return
    }
    wx.chooseImage({
      count: 1-imgs.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let imgs = that.data.imgs;
        if (tempFilePaths.length + imgs.length > 1) {
          limitMsg()
          return
        }
        // console.log(tempFilePaths + '----');
        wx.showLoading({ title: '上传中' })
        tempFilePaths.forEach((path, index) => {
          utils.pythonImgRequest({
            url: '/postNewImg/?item_id=4782',
            filePath: String(path),
            success: function (res) {
              console.log(res);
              if (res.data.code == 200) {
                let imageUrl = app.globalData.imgurl+"/"+res.data.data.pic_url; // 接口返回的图片地址
                that.setData({ imgs: [...imgs, imageUrl] });
                if (index === tempFilePaths.length - 1) {
                  wx.hideLoading();
                }
              }
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showToast({
                title: res.msg || '系统繁忙，请稍后重试',
                icon: 'none'
              });
            }
          })
        });
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  //提交到后台
  sureUpload:function(e){
    wx.showModal({
      title: '提交巡检结果',
      content: '确定提交？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
            mask:true
          })
          let count = 0;
          for (var i = 0; i < imgList.length; i++) {
            var imgUrl = imgList[i];
            utils.fileRequest({
              url: '/monitor/xjinfo/uploadimg',
              filePath: imgUrl,
              success:function(res){
                  console.log(res);
                  if(res.data.code == 200){
                    count++;
                    if(count == imgList.length){
                      wx.hideLoading();
                      wx.showToast({
                        title: '上传成功',
                        icon:"success",
                        duration:2000
                      })
                    }
                  }else{
                    if(count == imgList.length){
                      wx.hideLoading();
                      wx.showToast({
                        title: '上传成功',
                        icon:"success",
                        duration:2000
                      })
                    }
                    return;
                  }
              },
              fail:function(res){
                wx.hideLoading();
                return;
              }
            })
          } //for循环结束
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }
})