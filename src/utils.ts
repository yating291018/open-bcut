// export const getDeviceType = () => {
//   const u = navigator.userAgent;
//   const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
//   const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
//   return {
//     android: isAndroid,
//     ios: isIos
//   }
// }

export const getDeviceType = () => {
  const ua = navigator.userAgent
  return {
    baiduspider: (/Baiduspider/).test(ua),
    QQLive: (/QQLive/i).test(ua),
    mqq : (/QQ\/([\d\.]+)/i).test(ua),   //是否为手机QQ
    weibo: (/Weibo/i).test(ua), //是否为微博
    MicroMessenger: (/MicroMessenger/i).test(ua), //是否为微信
    mbaidu : (/baiduboxapp/i).test(ua),   //是否为手机百度
    iqiyi: (/iqiyi/i).test(ua),
    qq: (/MQQBrowser/i).test(ua), //是否为QQ浏览器
    mobile: (/AppleWebKit.*Mobile.*/i).test(ua), //是否为移动终端
    uc: (/UCBrowser/i).test(ua), //是否为UC
    xiaomiqjs: (/MiuiQuickSearchBox/).test(ua),
    dianping: (/dianping/).test(ua),
    ios: (/\(i[^;]+;( U;)? CPU.+Mac OS X/i).test(ua), //ios终端
    android: (/Android/i).test(ua) || (/Linux/i).test(ua), //android终端或者uc浏览器
    windowsphone: (/Windows Phone/i).test(ua), //Windows Phone
    iPhone: (/iPhone/i).test(ua), //是否为iPhone或者QQHD浏览器
    iPad: (/iPad/i).test(ua), //是否iPad
    webApp: !(/Safari/i).test(ua), //是否web应该程序，没有头部与底部
    baidu: (/Baidu/i).test(ua), //是否为百度浏览器
    Youku:(/youku/i).test(ua),
    chrome: (/CriOS/i).test(ua),
    CMDC: (/CMDC/i).test(ua),
    BiliApp: (/BiliApp/i).test(ua),
  }
}