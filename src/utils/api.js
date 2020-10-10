import Taro from '@tarojs/taro';

export const apiUrl = 'http://rap2api.taobao.org/app/mock/256282/mall';

/**
 * POST 请求
 */
export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: apiUrl + url,
      data: {
        ...params,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * GET 请求
 */
export function getRequest(url, params) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: apiUrl + url,
      data: {
        ...params,
      },
      method: 'GET',
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * 验证非空
 */
export function verVal(val) {
  return val !== '' && typeof val !== 'undefined' && val !== null;
}

/**
 * 验证是否是对象类型
 */
export function isObj(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 延迟执行
 */
export const delayFunc = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
