//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[
      '/image/ad1.jpg',
      '/image/ad2.jpg',
      '/image/ad3.jpg',
      '/image/ad4.jpg',
      '/image/ad5.jpg',
      '/image/ad6.jpg',
      '/image/ad7.jpg'
    ],
    navList:[
      {icon:'/image/nav-icon/diantai.png',events:'goToBangDan',text:'榜单'},
      {icon:'/image/nav-icon/diantai.png',events:'goToBangDan',text:'听小说'},
      {icon:'/image/nav-icon/diantai.png',events:'goToBangDan',text:'情感电台'},
      {icon:'/image/nav-icon/diantai.png',events:'goToBangDan',text:'听知识'},
      
    ],
    swiperCurrent: 0,
  },
  //轮播图改变事件
  swiperChange: function(e){
    this.setData({
     swiperCurrent: e.detail.current
    })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // //获得设备信息
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
    var url = 'https://mobile.ximalaya.com/mobile/discovery/v3/recommend/hotAndGuess?code=43_310000_3100&device=android&version=5.4.45';
      // 调用的是自己封装的工具函数，在utils中
      utils.myRequest({
        url:url,
        methods:'GET',
        success:function(result){
          that.setData({
            showitem:true,
            guess:result.data.paidArea.list,
            xiaoshuocontent:result.data.hotRecommends.list[0].list,
            xiangshengcontent:result.data.hotRecommends.list[2].list,
            tuokocontent:result.data.hotRecommends.list[4].list
          })
        },
        fail:function(){
          that.setData({
            showitem:false
          })
        }
      });
  },
  onShow() { //返回显示页面状态函数
    // 错误处理
    // this.onLoad(); //再次加载，实现返回上一页页面刷新(需要初始化变量)
    // 正确方法
    // 只执行获取地址的方法，来进行局部刷新(不能初始化变量)
    // 查看是否授权
    // let that = this;
    // if (app.globalData.userInfo === null) {
    //   that.setData({
    //     login: true
    //   })
    // } else {
    //   that.setData({
    //     login: false
    //   })
    // }
  },
  goToBangDan:function(){
    wx.navigateTo({
      url: '/pages/index/bangdan/bangdan',
    })
  },
  gotoDetails(e){
    var url = e.currentTarget.dataset.coverimg;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/details/details?url='+url+'&title='+title,
    })
  },
  // 获取用户的头像和昵称信息
  // bindGetUserInfo(e) {
  //   var that = this;
  //   wx.getUserInfo({
  //     success: function(res) {
  //       console.log(e.detail.userInfo);
  //       app.globalData.userInfo = e.detail.userInfo;
        
  //       let userinfoparam = {};
  //       let sessionKey = wx.getStorageSync('sessionKey');
  //       if(sessionKey == null || sessionKey == ""){
  //         app.mylogin();
  //         sessionKey = wx.getStorageSync('sessionKey');
  //       }
  //       userinfoparam.sessionKey = sessionKey;
  //       userinfoparam.signature = res.signature;
  //       userinfoparam.rawData = res.rawData;
  //       userinfoparam.encryptedData = res.encryptedData;
  //       userinfoparam.iv = res.iv;
  //       console.log(userinfoparam);
  //       utils.serverRequest({
  //         url: '/wx/user/'+app.globalData.appid+'/info',
  //         methods:'GET',
  //         data: userinfoparam,
  //         success:function(res){
  //           console.log(res);
  //           wx.setStorageSync('token', res.data.token);
  //           that.setData({
  //             login: false
  //           });
  //           app.mysetting();
  //         },
  //         fail:function(res){
  //         }
  //       });
  //     }
  //   })
  // },
  // phoneLogin:function(){
  //   wx.navigateTo({
  //     url: './phoneLogin/phoneLogin',
  //   });
  // },
  // gotoLogin(){
  //   wx.navigateTo({
  //     url: './phoneLogin/phoneLogin',
  //   });
  // },
})
