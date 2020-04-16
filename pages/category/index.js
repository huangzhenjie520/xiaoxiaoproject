// pages/category/index.js
import { axios } from "../../request/myAxios";
import regeneratorRuntime from "../../lib/runtime/runtime";
let cateAll;
Page({
  changeTabIndex(e) {
    const { index } = e.currentTarget.dataset;
    // console.log(index);

    this.setData({
      activeIndex: index,
      cateRight: cateAll[index].children,
      rightScrollTop: 0
    });
  },
  data: {
    activeIndex: 0,
    cateLeft: [],
    cateRight: [],
    rightScrollTop: 0
  },
  async getCateData() {
    const res = await axios({ url: "/categories" });
    this.setData({
      cateLeft: res.data.message.map(item => ({
        cat_id: item.cat_id,
        cat_name: item.cat_name
      })),
      cateRight: res.data.message[0].children
    });
    cateAll = res.data.message;
    wx.setStorageSync("cates", { time: Date.now(), data: res.data.message });
    // axios({
    //   url: "/categories"
    // }).then(res => {
    //   this.setData({
    //     cateLeft: res.data.message.map(item => ({
    //       cat_id: item.cat_id,
    //       cat_name: item.cat_name
    //     })),
    //     cateRight: res.data.message[0].children
    //   });
    //   cateAll = res.data.message;
    //   wx.setStorageSync("cates", { time: Date.now(), data: res.data.message });
    // });
  },
  onLoad() {
    const cates = wx.getStorageSync("cates");
    if (!cates) {
      this.getCateData();
    } else {
      if (Date.now() - cates.time > 1000 * 10) {
        this.getCateData();
      } else {
        cateAll = cates.data;
        this.setData({
          cateLeft: cates.map(item => ({
            cat_id: item.cat_id,
            cat_name: item.cat_name
          })),
          cateRight: cates[0].children
        });
      }
    }
  }
});
