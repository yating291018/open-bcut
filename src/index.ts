import { initEnv, biliBridge, isSupport, inBiliApp } from "@bilibili/js-bridge";
import { getDeviceType } from './utils'
initEnv();

type configType = {
  schema?: string;
  pageurl?: string;
  iosURL?: string;
  iosStoreURL?: string;
  androidURL?: string;
  packageName?: string;
  middlePageURl?: string;
  schemaType?: 'bcutSchema' | 'bcutSchemaH5';
}

const ua = typeof window === "undefined" ? "" : window.navigator.userAgent;
const isAndroid = /android|adr|linux/gi.test(ua);
const isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua);

// 中间承载页面
const middlePage = 'https://www.bilibili.com/blackboard/activity-XLNUvLvI6b.html'
// 唤醒必剪的默认scheme
const DEFAULT_SCHEME = "bcut://";
// IOS AppStore地址
const IOS_APPSTORE_URL = "https://apps.apple.com/cn/app/%E5%BF%85%E5%89%AA/id1299589486";
// 安卓下载地址
const ANDROID_DOWNLOAD_URL = "https://dl.hdslb.com/mobile/latest/bilistudio/android_bbs-master.apk";
// 安卓端包名
const PACKAGE_NAME = "com.bilibili.studio";
let bcut_timeout: NodeJS.Timeout | null = null


const isAppSupport = (methodName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    isSupport(methodName).then((support) => {
      if (support) {
        resolve(1);
      } else {
        reject(new Error("您的App版本太低，请升级至最新版本"));
      }
    });
  });
};

const callNative = (methodName: string, data: Record<string, unknown>) => {
  return new Promise((resolve, reject) => {
    isAppSupport(methodName).then(() => {
      biliBridge.callNative({
        method: methodName,
        data,
        callback(data) {
          resolve(data)
        }
      })
    }, reject)
  })
}

const isInstalled = (packageName: string, url: string) => {
  if (!inBiliApp) return Promise.reject()
  if (isAndroid) {
    return callNative('utils.isInstalled', {
      packageName
    }).then((data: any) => data && data.isInstalled)
  } else {
    return callNative('ability.canOpenApplication', {
      url
    }).then((data: any) => {
      /*
       * info: {
       *  code: 0, // 0 可以打开, -1 不支持, -2 不在白名单, -3 未安装
       *  errMsg: '' 
       * }
       */
      if (data.code === 0) {
        return true
      } else if (data.code === -3) {
        return false
      } else {
        return Promise.reject(new Error(data.errMsg))
      }
    })
  }
}

const openApp = (scheme: string, pageurl: string, schemaType: string) => {
  if (!inBiliApp) {
    return Promise.reject()
  }
  if (schemaType === 'bcutSchemaH5') {
    console.log('--进入了调用H5的页面')
    if (isIOS) {
      location.href = "bilibili://uper/appTraffic?appName=com.bilibili.studio&appScheme=bcut://studio/web/?h5_url=" + encodeURIComponent(pageurl)
    } else {
      location.href = "bcut://studio/web/?h5_url=" + encodeURIComponent(pageurl)
    }
    return Promise.resolve()
  }
  return callNative(isAndroid ? 'ability.openScheme' : 'ability.openApplication', {
    url: scheme
  }).then((data: any) => {
    return data.code === 0 ? true : Promise.reject(new Error('应用唤醒失败'))
  })
}

// 下载必剪
const getDownloadLink = () => {
  const browser = getDeviceType()
  if (inBiliApp && browser.android) {
    callNative('utils.openWithBrowser', {
      url: ANDROID_DOWNLOAD_URL
    }).then((data: any) => {
      return data.code === 0 ? true : Promise.reject(new Error('下载失败'))
    })
    return
  }
  if(browser.ios) {
    window.location.href = IOS_APPSTORE_URL
    return
  }
}

const goAppStore = (iosStoreURL: string) => {
  if (!inBiliApp) {
    return Promise.reject()
  }
  if (isAndroid) {
    getDownloadLink()
  } else {
    return callNative('biliapp.jumpToScheme', {
      url: iosStoreURL
    })
  }
}

// 端外掉起客户端
const outOpenBcut = (opt: {schema: string, androidURL: string, iosStoreURL: string, middlePageURl: string}) => {
  // 判断当前环境，如果是微信，微博，qq，百度的时候，走引导页面唤起和下载
  const browser = getDeviceType()
  if (browser.MicroMessenger || browser.mqq || browser.weibo) {
    location.href = opt.middlePageURl + '?schema=' + opt.schema
    return false
  }
  // 端外尝试唤醒必剪
  location.href = opt.schema
  bcut_timeout = setTimeout(() => {
    // 唤醒超时跳转至下载页
    if (isAndroid) {
      location.href = opt.androidURL
    }
    if (isIOS) {
      location.href = opt.iosStoreURL
    }
  }, 3000)
}

const visibilitychange = () => {
  const tag = document.hidden || (document as any).webkitHidden;
  if (tag && bcut_timeout) {
    clearTimeout(bcut_timeout)
  }
}

export const immediateDownload = (androidURL?: string, iosStoreURL?: string) => {
  if (isAndroid) {
    location.href = androidURL || ANDROID_DOWNLOAD_URL
  }
  if (isIOS) {
    location.href = iosStoreURL || IOS_APPSTORE_URL
  }
}

export const addEventListener = () => {
  // 兼容多的浏览器事件
  document.addEventListener('visibilitychange', visibilitychange, false);
  document.addEventListener('webkitvisibilitychange', visibilitychange, false);
  window.addEventListener('pagehide', visibilitychange, false)
}

export const removeEventListener = () => {
  // 兼容多的浏览器事件
  document.removeEventListener('visibilitychange', visibilitychange, false);
  document.removeEventListener('webkitvisibilitychange', visibilitychange, false);
  window.removeEventListener('pagehide', visibilitychange, false)
}

export const openBcut = (config: string | configType) => {
  let schema = DEFAULT_SCHEME
  let iosStoreURL = IOS_APPSTORE_URL
  let androidURL = ANDROID_DOWNLOAD_URL
  let packageName = PACKAGE_NAME
  let middlePageURl = middlePage
  let schemaType = 'bcutSchema'
  let pageurl = ''
  if (typeof config === 'string') {
    schema = config || schema
  } else if (config) {
    schema = config.schema || schema
    iosStoreURL = config.iosStoreURL || iosStoreURL
    androidURL = config.androidURL || androidURL
    packageName = config.packageName || packageName
    middlePageURl = config.middlePageURl || middlePage
    schemaType = config.schemaType || 'bcutSchema'
    pageurl = config.pageurl || ''
  }
  if (!inBiliApp) {
    outOpenBcut({schema, androidURL, iosStoreURL, middlePageURl})
    return Promise.resolve()
  } else {
    if (schemaType === 'bcutSchemaH5') {
      schema = 'bcut://studio/main?index=0'
    }
    return isInstalled(packageName, schema).then(installed => {
      if (installed) {
        return openApp(schema, pageurl, schemaType)
      } else {
        return goAppStore(iosStoreURL)
      }
    })
  }
}
