// pages/xjorder/xjorder.js
const utils = require('../../utils/utils.js');
const LocUtil = require('../../utils/location.js');
let isLocationClick = true;
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    imgs: [
      'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg',
      'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg',
      'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg',
      'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg',
    ],
    inputDisable:false,
    xjResult: '', // '1' 正常 '2' 异常
    chkpoint:[
      {
        content:'检查水泵运行声音是否正常检查水泵运行声音是否正常',
        result: 1
      },
      {
        content:'配电柜电流，频率显示状态',
        result: 2
      },
      {
        content:'各连接螺栓是否正常',
        result: ''
      },
      {
        content:'泵体及连接管道是否有漏水现象',
        result: ''
      },
      {
        content:'检查压力表是都在正常范围',
        result: ''
      }
    ],
    location: {

    },
    address: '1234',
    countPic:9,//上传图片最大数量
    showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
    uploadImgUrl:''//图片的上传的路径
  },
  
  //监听组件事件，返回的结果
  // myEventListener:function(e){
  //  console.log("上传的图片结果集合")
  //  console.log(e.detail.picsList)
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      username: app.globalData.userInfo.username
    })
  },
  getLoaction(){
    const _this = this;
    if (!isLocationClick) return;
    isLocationClick = false;
    LocUtil.getLocation(function (data) {
      console.log(data);
      isLocationClick = true;
      _this.setData({
        location: {
          latitude: data[0].latitude,
          longitude: data[0].longitude
        },
        address: data[0].regeocodeData.formatted_address
      })
    })
  },
  // 对或错
  handleErrOrSuccess (e){
    let {index, type} = e.currentTarget.dataset;
    this.setData({
      [`chkpoint[${index}].result`]: type
    })
  },
  // radio
  handleXjResult (e){
    let {type} = e.currentTarget.dataset;
    this.setData({
      xjResult: type
    })
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
  //选择图片
  chooseImg: function (e) {
    const that = this;
    const limitMsg = () => wx.showToast({ title: '最多只能上传9张图片', icon: 'none' })
    let imgs = this.data.imgs;
    if (imgs.length >= 9) {
      limitMsg()
      return
    }
    wx.chooseImage({
      count: 9-imgs.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let imgs = that.data.imgs;
        if (tempFilePaths.length + imgs.length > 9) {
          limitMsg()
          return
        }
        // console.log(tempFilePaths + '----');
        wx.showLoading({ title: '上传中' })
        tempFilePaths.forEach((path, index) => {
          utils.fileRequest({
            url: '/monitor/xjinfo/uploadimg',
            filePath: path,
            success: function (res) {
              console.log(res);
              if (res.data.code == 200) {
                let imageUrl = 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg'; // 接口返回的图片地址
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
  //检查字数
  checkInput:function(e){
    var that=this;
    if(e.detail.value.length>=100){
      wx.showToast({
        title: '备注不能超过100个字',
        icon:"none",
        duration:2000
      })
    }
  },
  //上传到后台
  sureUpload:function(e){
    var imgList = this.data.imgs;
    if(imgList.length>8){
      wx.showToast({
        title: '上传的图片不能超过9张',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.showModal({
      title: '上传作品',
      content: '确定上传？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在上传',
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


          // setTimeout(function () {
          //   wx.hideLoading()
          //   wx.showToast({
          //     title: '上传成功',
          //     icon:"success",
          //     duration:2000
          //   })
          // }, 4000)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  }
})