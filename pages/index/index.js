//index.js
//获取应用实例
const app = getApp();
import { axios } from "../../request/myAxios";
Page({
  data: {
    swiperList: [],
    navList: [],
    floorList: [],
    showTop: false
  },
  onLoad() {
    // 轮播图
    axios({
      url: "/home/swiperdata",
      method: "get",
      dataType: "json"
    }).then(res => {
      // console.log(res.data.message);
      this.setData({
        swiperList: res.data.message
      });
    });
    // 导航分类
    axios({
      url: "/home/catitems",
      method: "get",
      dataType: "json"
    }).then(res => {
      console.log(res.data.message);
      this.setData({
        navList: res.data.message
      });
    });
    // 首页楼层
    axios({
      url: "/home/floordata",
      method: "get",
      dataType: "json"
    }).then(res => {
      console.log(res.data.message);
      this.setData({
        floorList: res.data.message.map((item, index) => {
          return {
            id: index,
            floor_title: item.floor_title,
            product_list: item.product_list
          };
        })
      });
    });
    // wx.request({
    //   url: "/home/swiperdata",
    //   method: "get",
    //   dataType: "json",
    //   success: res => {
    //     console.log(res);
    //   },
    //   fail: err => {
    //     console.log(err);
    //   },
    //   complete: () => {}
    // });
  },
  // 首页楼层图片跳转到列表页
  goToPageList(e) {
    // console.log(e.currentTarget);
    let { url, type } = e.currentTarget.dataset;
    const urlArr = url.split("?");
    urlArr.splice(1, 0, "/index?");
    // console.log(urlArr.join(""));
    if (type === "navigate") {
      wx.navigateTo({
        url: urlArr.join("")
      });
    }
  },
  onPullDownRefresh() {
    console.log("用户下拉");
    this.setData({
      swiperList: [],
      navList: [],
      floorList: []
    });
    this.onLoad();
  },
  onPageScroll(e) {
    if (e.scrollTop >= 100) {
      this.setData({
        showTop: true
      });
    } else {
      this.setData({
        showTop: false
      });
    }
  }
});
