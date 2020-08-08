/**
 * 本文件主要是工具类函数
 */
// let apiRoot = 'http://localhost:8050/itwx';
let apiRoot = 'https://letsmodel.cn:8050/itwx';
let apiPythonRoot = 'https://micro-service.online:8051/api';
// let apiRoot = 'http://localhost:8050/itwx';

 /*
  自己基于wx.request封装的一个请求函数（粗陋封装各位不要笑话）
  因为在小程序开发中request是最常用的api所以会造成很多的代码重复
  因此将其在封装之后可以大大的减少代码的复用
*/
let myRequest = function(args = {url:'',methods:'', data:{}, success:function(){},fail:function(){}}){
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

let fileRequest = function(args = {url:'', filePath:'', success:function(){},fail:function(){}}){
  wx.uploadFile({
      url: apiRoot+args.url,
      header: {'token':wx.getStorageSync('token')},
      filePath: args.filePath,
      name: 'file',
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        if(res.statusCode == 200){
          // 请求成功执行回调函数
          let data = res.data;
          // 为什么这么这么写，看下文
          if ('object' !== typeof data) {
            //坑一：与wx.request不同，wx.uploadFile返回的是[字符串]，需要自己转为JSON格式
            //如果不转换，直接用点运算符是获取不到后台返回的值的
            data = JSON.parse(data)
            res.data = data;
          }
          args.success(res)
        }else{
          // 请求失败执行回调函数
          args.fail()
        }
      },
  })
}

let serverRequest = function(args = {url:'',methods:'', data:{}, success:function(){},fail:function(){}}){
  if(args.methods == "POST"){
    wx.request({
      url: apiRoot+args.url,
      data: args.data,
      header: {'content-type':'application/x-www-form-urlencoded','token':wx.getStorageSync('token')},
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
  }else{
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
}

let pythonRequest = function(args = {url:'',methods:'', data:{}, success:function(){},fail:function(){}}){
  if(args.methods == "POST"){
    wx.request({
      url: apiPythonRoot+args.url,
      data: args.data,
      header: {'content-type':'application/x-www-form-urlencoded','Authorization':'JWT '+wx.getStorageSync('token')},
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
  }else{
    wx.request({
      url: apiPythonRoot+args.url,
      data: args.data,
      header: {'content-type':'application/json','Authorization':'JWT '+wx.getStorageSync('token')},
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
}

let pythonFileRequest = function(args = {url:'', filePath:'', success:function(){},fail:function(){}}){
  wx.uploadFile({
      url: apiPythonRoot+args.url,
      header: {'Authorization':'JWT '+wx.getStorageSync('token')},
      filePath: args.filePath,
      name: 'file',
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        if(res.statusCode == 200){
          // 请求成功执行回调函数
          let data = res.data;
          // 为什么这么这么写，看下文
          if ('object' !== typeof data) {
            //坑一：与wx.request不同，wx.uploadFile返回的是[字符串]，需要自己转为JSON格式
            //如果不转换，直接用点运算符是获取不到后台返回的值的
            data = JSON.parse(data)
            res.data = data;
          }
          args.success(res)
        }else{
          // 请求失败执行回调函数
          args.fail()
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
  loginAndSaveUser: loginAndSaveUser,
  fileRequest: fileRequest,
  pythonRequest: pythonRequest
}