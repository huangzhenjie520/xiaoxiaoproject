// pages/auth/index.js
import regeneratorRuntime from "../../lib/runtime/runtime";
import { axios } from "../../request/myAxios";
Component({
  // 1.获取用户信息
  // 2.小程序登录
  // 3.提交数据到自己的后台执行post请求提交数据
  // 4.将'token'和用户数据'userinfo'存入本地存储
  data: {},
  methods: {
    async getUserInfo({ detail }) {
      // console.log(e);
      // const { detail } = e;
      // console.log(detail);
      // 1.获取用户信息，其中4个是用于请求的,userinfo是用户做界面展示的
      try {
        const { userInfo, signature, rawData, iv, encryptedData } = detail;

        // 2.小程序登录（相当于一个验证码）

        // wx.login({
        //   success: result => {
        //     const { code } = result;
        //     console.log(code);
        //   }
        // });
        // wx.login().then(result => {
        //   const { code } = result;
        //   console.log(code);
        // });
        const { code } = await wx.login();
        // console.log(res);
        // const { code } = result;
        // console.log(code);
        const res = await axios({
          url: "/users/wxlogin",
          method: "POST",
          data: { signature, rawData, iv, encryptedData, code },
        });
        const { token } = res.data.message;
        wx.setStorageSync("userInfo", userInfo);
        wx.setStorageSync("token", token);
        // 子传父更新父页面视图
        this.triggerEvent("upDataUserInfo", { userInfo });
        // 登录成功后跳转回上一个页面(支付页,个人中心也)
        const routers = getCurrentPages();
        if (routers.length > 1) {
          wx.navigateBack({
            delta: 1,
          });
        }
      } catch (error) {
        // 登录失败
        wx.showToast({
          title: "登录授权失败，请重试",
          icon: "none",
        });
      }
    },
  },
  // 获取用户信息函数
});
