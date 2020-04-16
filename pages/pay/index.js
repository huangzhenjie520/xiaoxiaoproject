// 1 先判断缓存中有没有token
// 2 没有 跳转到授权页面 进行获取token
// 3 有token 。。。
// 4 创建订单 获取订单编号
// 5 已经完成了微信支付
// 6 手动删除缓存中 已经被选中了的商品
// 7 删除后的购物车数据 填充回缓存
// 8 再跳转订单页面
import regeneratorRuntime from "../../lib/runtime/runtime";
import { axios } from "../../request/myAxios";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    totalPrice: 0,
    totalCount: 0,
    userAddress: {}
  },
  onShow() {
    const cart = wx.getStorageSync("cart" || []);
    this.cartComputed(cart);
    const userAddress = wx.getStorageSync("userAddress") || {};
    this.setData({
      userAddress
    });
  },
  cartComputed(cart) {
    // 计算前把总金额、选中个数初始化为0
    let totalPrice = 0,
      totalCount = 0;
    cart.forEach(item => {
      if (item.isSelect) {
        totalPrice += item.number * item.goods_price;
        totalCount++;
      }
    });
    // 如果购物车数组为空，就不会进入遍历

    this.setData({
      totalPrice,
      totalCount,
      cart
    });
    // wx.setStorageSync("cart", cart);
    // console.log(totalPrice, totalCount);
  },
  getUserAddress() {
    // 1.获取洪湖地址授权请情况
    wx.getSetting({
      success: result => {
        console.log(result);
        const scopeAddress = result.authSetting["scope.address"];
        // true 授权
        // false 拒绝授权
        // undefined 没有调用过接口

        // 2.如果已授权才能调用收回地址接口
        if (scopeAddress || scopeAddress === undefined) {
          wx.chooseAddress({
            success: result => {
              console.log(result);
              const {
                telNumber,
                userName,
                detailInfo,
                cityName,
                countyName,
                provinceName
              } = result;
              const userAddress = {
                userName,
                telNumber,
                detail: provinceName + cityName + countyName + detailInfo
              };
              this.setData({
                userAddress
              });
              wx.setStorageSync("userAddress", userAddress);
            },
            fail: err => {
              console.log(err);
            },
            complete: () => {}
          });
        } else {
          // 3.如果没有授权，打开设置界面
          wx.openSetting();
        }
      }
    });
  },
  // 支付按钮
  async goToPay() {
    const { userAddress } = this.data;
    // 1.判断用户有没有收货地址
    if (!userAddress.userName) {
      wx.showToast({
        title: "请选择收件人",
        icon: "none"
      });
    }
    // 2.判断用户是否登录
    const token = wx.getStorageSync("token");

    if (!token) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
        duration: 500,
        success: res => {
          wx.navigateTo({
            url: "/pages/auth/index"
          });
        }
      });
    } else {
      // 获取总价格
      const order_price = this.data.totalPrice;
      // 获取订单地址
      const consignee_addr = this.data.userAddress.detail;
      // 商品列表(数组格式)
      // 1.选中的商品
      // 2.把数组内的对象映射成要求格式
      const goods = this.data.cart
        .filter(v => v.isSelect)
        .map(v => ({
          goods_id: v.goods_id,
          goods_number: v.number,
          goods_price: v.goods_price
        }));
      // console.log(order_price, consignee_addr);
      // console.log(goods);

      // 4 创建订单 获取订单编号
      try {
        const res = await axios({
          method: "POST",
          url: "/my/orders/create",
          data: {
            // 订单总价格
            order_price,
            // 订单地址
            consignee_addr,
            // 商品列表(数组格式)
            goods
          }
        });
        // 4.1创建订单，获取订单编号
        const order_number = res.data.message.order_number;
        // console.log(order_number);
        // 4.2通过订单号生成微信支付需要的参数对象
        const payres = await axios({
          method: "POST",
          url: "/my/orders/req_unifiedorder",
          data: { order_number }
        });
        const pay = payres.data.message.pay;
        // console.log(pay);
        // 4.3 调用了微信支付
        await wx.requestPayment(pay);
        // console.log(result);
        // 4.4.发送请求检查订单是否翼支付，已支付更新订单状态
        // 问一下微信服务器是否收到钱了，如果收到钱就更新订单状态
        // 小程序端无法直接发送请求到微信服务器，都是让公司服务器向微信服务器发送请求检验状态
        const result = await axios({
          url: "/my/orders/chkOrder",
          method: "post",
          data: { order_number }
        });
        console.log(result.data.message.msg);
        // 支付成功后的处理
        this.payOrderSuccess();
      } catch (error) {
        // 失败提示
        wx.showToast({
          title: "出现错误,支付失败",
          icon: "none"
        });
      }
      // 6 手动删除缓存中 已经被选中了的商品
      // 7 删除后的购物车数据 填充回缓存
      // 8 再跳转订单页面
    }

    // 3.创建订单，实现支付
  },
  payOrderSuccess() {
    // 1.本地存储数据操作
    let { cart } = this.data;
    // 过滤出没有选中的商品
    cart = cart.filter(v => !v.isSelect);
    // console.log(cart);

    // 把没有选中的商品保存到本地存储中，覆盖原本的数据
    wx.setStorageSync("cart", cart);
    // 2.跳转到订单页面
    wx.redirectTo({
      url: "/pages/order/index"
    });
  }
});
