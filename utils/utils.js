/**
 * 本文件主要是工具类函数
 */
let apiRoot = 'http://10.84.11.38:8050/itwx';
// let apiRoot = 'https://letsmodel.cn:8050/itwx';

 /*
  自己基于wx.request封装的一个请求函数（粗陋封装各位不要笑话）
  因为在小程序开发中request是最常用的api所以会造成很多的代码重复
  因此将其在封装之后可以大大的减少代码的复用
*/
let myRequest = function(args = {url:'',methods:'GET', data:{}, success:function(){},fail:function(){}}){
    wx.request({
        url: args.url,
        data: args.data,
        header: {'content-type':'application/json'},
        method: args.methods,
        dataType: 'json',
        responseType: 'text',
        success: (res)=>{
          console.log(res);
          if(res.statusCode == 200){
            // 请求成功执行回调函数
            args.success(res)
          }else{
            // 请求失败执行回调函数
            args.fail()
          }
        },
    })
}

let serverRequest = function(args = {url:'',methods:'GET', data:{}, success:function(){},fail:function(){}}){
  wx.request({
      url: apiRoot+args.url,
      data: args.data,
      header: {'content-type':'application/json','token':wx.getStorageSync('token')},
      method: args.methods,
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        console.log(res);
        if(res.statusCode == 200){
          // 请求成功执行回调函数
          args.success(res)
        }else{
          // 请求失败执行回调函数
          args.fail(res)
        }
      },
  })
}

let loginAndSaveUser = function(){
  wx.getUserInfo({
    success: function(res) {
      console.log(e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo;
      
      let userinfoparam = {};
      let sessionKey = wx.getStorageSync('sessionKey');
      if(sessionKey == null || sessionKey == ""){
        app.mylogin();
        sessionKey = wx.getStorageSync('sessionKey');
      }
      userinfoparam.sessionKey = sessionKey;
      userinfoparam.signature = res.signature;
      userinfoparam.rawData = res.rawData;
      userinfoparam.encryptedData = res.encryptedData;
      userinfoparam.iv = res.iv;
      console.log(userinfoparam);
      utils.serverRequest({
        url: '/wx/user/'+app.globalData.appid+'/info',
        methods:'GET',
        data: userinfoparam,
        success:function(res){
          console.log(res);
          wx.setStorageSync('token', res.data.token);
          that.setData({
            login: false
          });
          app.mysetting();
        },
        fail:function(res){
        }
      });
    }
  })
}

// 向外暴露接口
module.exports = {
  myRequest : myRequest,
  serverRequest: serverRequest,
  loginAndSaveUser: loginAndSaveUser
}