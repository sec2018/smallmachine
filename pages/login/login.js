const app = getApp();
var utils = require('../../utils/utils.js');

Page({
    data: {
        showLogin: true,
        name: "",
        password: "",
        showDouKou: false,
        url: ""
    },
    onLoad() {
        
    },
    onShow(){
        wx.checkSession({
            success: (res) => {
              // session_key未过期
            //   if(wx.getStorageSync("token")!=null && app.globalData.userInfo!=null){
                if(wx.getStorageSync("token")!=null && wx.getStorageSync("token")!="" && app.globalData.userInfo!=null){
                    var that = this;
                    utils.pythonRequest({
                        url: '/verifyToken/',
                        methods:'POST',
                        success:function(res){
                            console.log(res);
                            if(res.data.code == 200){
                                wx.reLaunch({
                                    url: "/pages/main/main"
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
            fail: (res) => {
              // 登录
              return;
            }
        });
    },
    onInput({ detail, currentTarget }) {
        let data = this.data;
        data[currentTarget.dataset.type] = detail.value;
        this.setData(data);
    },
    onLogin() {
        if (!this.data.name) {
            wx.showToast({ mask: true, icon: "none", title: "工号不能为空" });
            return;
        }
        if (!this.data.password) {
            wx.showToast({ mask: true, icon: "none", title: "密码不能为空" });
            return;
        }
        let dataparam = {};
        dataparam.username = this.data.name;
        dataparam.password = this.data.password;
        // utils.serverRequest({
        //     url: '/wx/user/'+app.globalData.appid+'/login',
        wx.showLoading({
            title: '登录中...',
            mask: true,
        })
        // // 登录
        // wx.login({
        //     success: res => {
        //         // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //         dataParam.code = res.code;
        //     }
        // });
        utils.pythonRequest({
            url: '/getJWTtoken/',
            methods: "POST",
            data: dataparam,
            success: res => {
                if (res.data.code == 500) {
                    wx.showToast({
                        mask: true,
                        icon: "none",
                        title: res.data.msg
                    });
                    return;
                }
                this.loginSuccess(res.data.data);
            },
            fail: res => {
                wx.showToast({
                    title: '用户认证失败',
                    icon:"none",
                    duration:5000
                })
            }
        });
    },

    loginSuccess({ token = "", userinfo = {} }) {
        wx.hideToast();
        if (!token) {
            this.setData({ showLogin: true });
        } else {
            wx.setStorageSync("token", token);
            wx.setStorageSync("userInfo", JSON.stringify(userinfo));
            app.globalData.userInfo = userinfo;
            // if(userinfo.is_superuser){
            //     wx.reLaunch({
            //         url: "/pages/main/main"
            //     });
            // }else{
            //     wx.reLaunch({
            //         url: '/pages/singlecompany/singlecompany?username='+username,
            //     });
            // }

            wx.reLaunch({
                url: "/pages/main/main?username="+userinfo.username,
            });
            wx.hideLoading();
            // apiStaff.staffInfo({
            //     success: staffInfo => {
            //         Object.keys(staffInfo).map(el => {
            //             wx.setStorageSync(el, staffInfo[el]);
            //         });
            //         if (this.data.url) {
            //             wx.redirectTo({
            //                 url: this.data.url
            //             });
            //             return;
            //         }
            //         wx.reLaunch({
            //             url: "/pages/home/home"
            //         });
            //         wx.hideLoading();
            //     }
            // });
        }
    }
});
