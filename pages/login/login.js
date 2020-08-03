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
                    utils.serverRequest({
                        url: '/checktoken',
                        methods:'GET',
                        success:function(res){
                            console.log(res);
                            if(res.data.code == 200){
                                wx.reLaunch({
                                    url: "/pages/index/index"
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
        utils.serverRequest({
            url: '/wx/user/'+app.globalData.appid+'/login',
            type: "GET",
            data: {
                username: this.data.name,
                password: this.data.password
            },
            success: res => {
                if (res.data.code == 500) {
                    wx.showToast({
                        mask: true,
                        icon: "none",
                        title: res.data.msg
                    });
                    return;
                }
                this.loginSuccess(res.data);
            }
        });
    },

    loginSuccess({ token = "", userInfo = {} }) {
        wx.hideToast();
        if (!token) {
            this.setData({ showLogin: true });
        } else {
            wx.setStorageSync("token", token);
            app.globalData.userInfo = userInfo;
            wx.reLaunch({
                url: "/pages/index/index"
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
