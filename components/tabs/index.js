// components/tabs/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
    activeIndex: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTabIndex(e) {
      const { index } = e.currentTarget.dataset;
      // console.log(index);
      this.setData({
        activeIndex: index,
      });
      this.triggerEvent("getTabIndex", { index });
    },
  },
});
