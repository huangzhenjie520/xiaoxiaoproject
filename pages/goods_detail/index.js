import { axios } from "../../request/myAxios";
let goodsObj = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    goods_name: 0,
    goods_price: "",
    goods_introduce: ""
  },
  onLoad(options) {
    console.log(options);

    this.getGoodsDetail();
  },
  getGoodsDetail() {
    const { goods_id } = this.options;
    axios({
      url: "/goods/detail",
      data: {
        goods_id: goods_id
      }
    }).then(res => {
      console.log(res.data.message);
      let { pics, goods_name, goods_price, goods_introduce } = res.data.message;
      const { system } = wx.getSystemInfoSync();
      // console.log(system);
      if (system.toLowerCase().indexOf("ios") > -1) {
        // console.log("asdasd");
        // \?   转义问号
        // .+?  点代表任意字符，+至少一个.?用来结束第一个匹配(防止贪婪)
        // g    全部匹配
        goods_introduce = goods_introduce.replace(/\?.+?webp/g, "");
        // console.log(goods_introduce);
      }
      this.setData({
        pics,
        goods_name,
        goods_price,
        goods_introduce
      });
      // 把商品核心信息用一个对象管理，用于加入购物车
      goodsObj = {
        goods_name,
        goods_price,
        goods_id,
        goods_image: res.data.message.goods_small_logo
      };
    });
  },
  showBigImage(e) {
    const { current } = e.currentTarget.dataset;
    const urls = this.data.pics.map(v => v.pics_big);
    wx.previewImage({
      current,
      urls
    });
  },
  addToCart() {
    // console.log("点击");
    // console.log(goodsObj);
    const cart = wx.getStorageSync("cart") || [];
    const index = cart.findIndex(v => v.goods_id === goodsObj.goods_id);
    if (index === -1) {
      goodsObj.isSelect = true;
      goodsObj.number = 1;
      cart.unshift(goodsObj);
    } else {
      cart[index].number++;
    }
    console.log(cart);

    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: "加入购物车成功",
      icon: "success",
      mask: true
    });
  },
  buyNow() {
    console.log("点击了立即购买");
  },
  goToPageCart() {
    // 购物车页面是tabBar页面，需要用switchTab
    wx.switchTab({
      url: "/pages/cart/index"
    });
  },
  addToCollect() {
    console.log("点击收藏按钮");
  }
});
