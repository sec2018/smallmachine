// component/xjdetailcom/index.js
const utils = require('../../utils/utils.js');
function handleItem(data){
  let keyName = ['perfect', 'good', 'normal', 'repair', 'replace'];
  let list = keyName.map(item => {
    return {
      id: item,
      value: data.check_point && data.check_point['cretia_'+item]
    }
  })
  console.log(list, 'list')
  return list
}
Component({
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      var _item = this.data.defaultData;
      this.setData({
        itemList: handleItem(_item)
      })
      console.log(_item, 'lll')
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    defaultData: {
      type: Object,
      default: () => {}
    },
    paramName: {
      type: String,
      default: ''
    },
    paramIndex: {
      type: Number,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemId: '',
    itemList: [],
    imgs: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItem: function (e) {
      let id = e.currentTarget.dataset.id;
      console.log(id)
      if(id !== this.data.itemId){
        this.setData({
          itemId: id
        })
      }
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
        count: 1 - imgs.length, // 默认9
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
                  let imageUrl = app.globalData.imgurl + "/" + res.data.data.pic_url; // 接口返回的图片地址
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
    // 保存按钮
    handleSave(){
      if(!this.data.itemId){
        wx.showToast({
          title: '请选择检查项结果',
          icon: 'none'
        })
        return
      }
      this.triggerEvent('success', {
        data: {
          ...this.data.defaultData,
          result: this.data.itemId,
          pic_url: this.data.imgs.join(',')
        },
        params: {
          paramName: this.data.paramName,
          paramIndex: this.data.paramIndex
        }
      })
    }
  }
})
