// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  onShow() {
    const userInfo = wx.getStorageSync("userInfo") || {};
    console.log(userInfo);

    this.setData({
      userInfo,
    });
  },
  // 子组件通过事件更新父页面用户信息
  upDataUserInfo(e) {
    // console.log("联系到了");

    const { userInfo } = e.detail;
    this.setData({
      userInfo,
    });
  },
});
