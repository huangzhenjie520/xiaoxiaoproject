// pages/order/index.js
import { axios } from "../../request/myAxios";
const { formatTime } = require("../../utils/util");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 1,
        text: "全部",
      },
      {
        id: 2,
        text: "待付款",
      },
      {
        id: 3,
        text: "待发货",
      },
    ],
    orders: [],
    activeIndex: 0,
  },
  onLoad() {
    this.getOrderData();
    console.log(Date.now());
  },
  // 触发子传父组件的时候，获取子组件传递的索引
  getTabIndex(e) {
    // console.log("子组件", e);
    const { index } = e.detail;
    const { tabs } = this.data;
    // console.log(index);
    this.getOrderData(tabs[index].id);
  },
  // 根据type的值，请求不同订单列表
  getOrderData(type = 1) {
    // 获取订单数据
    axios({
      url: "/my/orders/all",
      data: {
        type,
      },
    }).then((res) => {
      const { orders } = res.data.message;
      // console.log(orders);
      orders.forEach((element) => {
        element.formatTime = formatTime(new Date(element.create_time * 1000));
      });
      this.setData({
        orders,
      });
    });
  },
  onLoad(options) {
    const type = options.type || 1;
    this.getOrderData(type);

    this.setData({
      activeIndex: type - 1,
    });
    // console.log(activeIndex);
  },
});
