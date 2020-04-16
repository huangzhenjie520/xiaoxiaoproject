// components/toTop/index.js
Component({
  /**
   * 组件的方法列表
   */
  methods: {
    goToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  }
});
