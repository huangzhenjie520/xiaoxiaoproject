const baseURL = "https://api-hmugo-web.itheima.net/api/public/v1";
export const axios = params => {
  if (params.url.indexOf("/my/") > -1) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({ url: "/pages/auth/index" });
    } else {
      // 在 request 请求参数中添加Authorization=token
      params.header = { Authorization: token };
    }
  }
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseURL + params.url,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
      complete: () => {}
    });
  });
};
