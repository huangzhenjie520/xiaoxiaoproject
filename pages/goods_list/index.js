// pages/goods_list/index.js
import { axios } from "../../request/myAxios";
const params = {
  query: "",
  cid: "",
  pagenum: 1,
  pagesize: 10
};
let totalCount = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    tabs: [
      {
        id: 1,
        text: "综合"
      },
      {
        id: 2,
        text: "销量"
      },
      {
        id: 3,
        text: "价格"
      }
    ],
    goodsList: []
  },
  changeTabIndex(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index
    });
  },
  getGoodsList() {
    axios({
      url: "/goods/search",
      data: params
    }).then(res => {
      totalCount = res.data.message.total;
      console.log(res.data.message);
      this.setData({
        goodsList: [...this.data.goodsList, ...res.data.message.goods]
      });
      wx.stopPullDownRefresh();
    });
  },
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    });
    params.pagenum = 1;
    this.getGoodsList();
  },
  onReachBottom() {
    console.log("到底了");
    if (Math.ceil(totalCount / params.pagesize) > params.pagenum) {
      params.pagenum++;
      this.getGoodsList();
    } else {
      wx.showToast({ title: "没有数据了" });
    }
  },
  onLoad(options) {
    console.log(options);
    params.cid = options.cat_id || "";
    params.query = options.query || "";
    this.getGoodsList();
  }
});
