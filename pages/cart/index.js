// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    totalCount: 0,
    totalPrice: 0,
    selectAll: true
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      cart
    });
    // 实现购物车计算调用
    this.cartComputed(cart);
  },
  // 购物车计算封装
  cartComputed(cart) {
    // 计算前把总金额、选中个数初始化为0
    let totalPrice = 0,
      totalCount = 0,
      selectAll = true;
    cart.forEach(item => {
      if (item.isSelect) {
        totalPrice += item.number * item.goods_price;
        totalCount++;
      } else {
        // 如果有一个不为真就取假
        selectAll = false;
      }
    });
    // 如果购物车数组为空，就不会进入遍历
    if (cart.length === 0) {
      selectAll = false;
    }

    this.setData({
      totalPrice,
      totalCount,
      selectAll,
      cart
    });
    wx.setStorageSync("cart", cart);
    // console.log(totalPrice, totalCount);
  },
  changeSelectAll() {
    let { selectAll, cart } = this.data;
    selectAll = !selectAll;
    cart.forEach(item => {
      item.isSelect = selectAll;
    });
    this.setData({
      selectAll,
      cart
    });
    this.cartComputed(cart);
  },
  changeSelectItem(e) {
    const { index } = e.currentTarget.dataset;
    // console.log(index);
    const { cart } = this.data;
    cart[index].isSelect = !cart[index].isSelect;
    this.cartComputed(cart);
  },
  changeCount(e) {
    const { index, number } = e.currentTarget.dataset;
    const { cart } = this.data;

    if (number === -1 && cart[index].number === 1) {
      wx.showModal({
        title: "是否删除商品",
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "删除",
        confirmColor: "#999",
        success: result => {
          if (result.confirm) {
            cart.splice(index, 1);
            this.cartComputed(cart);
          } else {
          }
        }
      });
    } else {
      cart[index].number += number;
      this.cartComputed(cart);
    }
  },
  goToPay() {
    const { totalCount } = this.data;
    if (totalCount) {
      wx.navigateTo({
        url: "/pages/pay/index"
      });
    }
  }
});
