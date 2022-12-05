import Taro from '@tarojs/taro';
import { wxToast } from '@/utils/wxApi.js';

// 接口地址
let baseUrl = '';

/**
 * @desc GET 请求
 */
export function getRequest(url, params) {
  return new Promise((resolve, reject) => {
    let header = {};
    if (Taro.getStorageSync('accessToken')) {
      header = { Authorization: Taro.getStorageSync('accessToken') };
    }

    if (Taro.baseUrl) {
      baseUrl = Taro.baseUrl;
    }

    Taro.request({
      url: `${baseUrl}${url}`,
      data: {
        ...params,
      },
      method: 'GET',
      header,
    })
      .then((res) => {
        const { data = {} } = res;

        switch (data.status) {
          case 200:
            resolve(data);
            break;
          case 500:
            resolve(data);
            wxToast(data.msg || '系统错误');
            break;
          case 401:
            wxToast(header.Authorization ? '登录失效，请重新登录' : '请先登录');
            setTimeout(() => {
              Taro.reLaunch({ url: '/pages/basicLayout/index' });
            }, 2000);
            break;
          default:
            resolve(data);
        }
      })
      .catch((error) => reject(error));
  });
}

/**
 * @desc POST 请求
 */
export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    let header = {};
    if (Taro.getStorageSync('accessToken')) {
      header = { Authorization: Taro.getStorageSync('accessToken') };
    }

    if (Taro.baseUrl) {
      baseUrl = Taro.baseUrl;
    }

    Taro.request({
      url: `${baseUrl}${url}`,
      data: {
        ...params,
      },
      method: 'POST',
      header: {
        ...header,
        'content-type': 'application/json',
      },
    })

      .then((res) => {
        const { data = {} } = res;

        switch (data.status) {
          case 200:
            resolve(data);
            break;
          case 500:
            resolve(data);
            wxToast(data.msg || '系统错误');
            break;
          case 401:
            wxToast(header.Authorization ? '登录失效，请重新登录' : '请先登录');
            setTimeout(() => {
              Taro.reLaunch({ url: '/pages/basicLayout/index' });
            }, 2000);
            break;
          default:
            resolve(data);
        }
      })
      .catch((error) => reject(error));
  });
}

/**
 * @desc POST FormData请求
 */
export function postRequestFormData(url, params) {
  return new Promise((resolve, reject) => {
    let header = {};
    if (Taro.getStorageSync('accessToken')) {
      header = { Authorization: Taro.getStorageSync('accessToken') };
    }
    let paramStr = '';
    for (const key in params) {
      if (key) {
        paramStr = `${paramStr + key}=${params[key]}&`;
      }
    }
    if (paramStr !== '') {
      paramStr = paramStr.substr(0, paramStr.length - 1);
    }

    if (Taro.baseUrl) {
      baseUrl = Taro.baseUrl;
    }

    Taro.request({
      url: `${baseUrl}${url}`,
      data: paramStr,
      method: 'POST',
      header: {
        ...header,
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => {
        const { data = {} } = res;

        switch (data.status) {
          case 200:
            resolve(data);
            break;
          case 500:
            resolve(data);
            wxToast(data.msg || '系统错误');
            break;
          case 401:
            wxToast(header.Authorization ? '登录失效，请重新登录' : '请先登录');
            setTimeout(() => {
              Taro.reLaunch({ url: '/pages/basicLayout/index' });
            }, 2000);
            break;
          default:
            resolve(data);
        }
      })
      .catch((error) => reject(error));
  });
}

/**
 * @desc delete 请求
 */
export function deleteRequest(url, params) {
  return new Promise((resolve, reject) => {
    let header = {};
    if (Taro.getStorageSync('accessToken')) {
      header = { Authorization: Taro.getStorageSync('accessToken') };
    }

    const getParams = Object.keys(params)
      .map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
      })
      .join('&');

    if (Taro.baseUrl) {
      baseUrl = Taro.baseUrl;
    }

    Taro.request({
      url: `${baseUrl}${url}?${getParams}`,
      data: {
        ...params,
      },
      method: 'DELETE',
      header,
    })
      .then((res) => {
        const { data = {} } = res;

        switch (data.status) {
          case 200:
            resolve(data);
            break;
          case 500:
            resolve(data);
            wxToast(data.msg || '系统错误');
            break;
          case 401:
            wxToast(header.Authorization ? '登录失效，请重新登录' : '请先登录');
            setTimeout(() => {
              Taro.reLaunch({ url: '/pages/basicLayout/index' });
            }, 2000);
            break;
          default:
            resolve(data);
        }
      })
      .catch((error) => reject(error));
  });
}
